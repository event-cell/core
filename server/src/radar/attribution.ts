// Works out which run a radar reading belongs to, from the reading's own
// timestamp rather than from whatever is on course when it arrives.
//
// This matters because the MQTT feed is not reliable: readings can arrive late,
// out of order, in a burst after the network returns, or more than once. A
// reading is therefore placed by asking the timing database which run was under
// way at that moment, so a message delayed by ten minutes still lands on the car
// that earned it, and replaying the same message twice changes nothing.
//
// Times in the timing database are microseconds since local midnight, held in
// C_HOUR2 as a string. The radar publishes Day_secs in seconds since local
// midnight, so the two meet after multiplying by a million.

import { eventData } from '../router/shared.js'
import { setupLogger } from '../utils/index.js'

const logger = setupLogger('radar/attribution')

/** Microseconds per second, the conversion between Day_secs and C_HOUR2 */
export const MICROS_PER_SECOND = 1_000_000

/**
 * How long a run may plausibly take. Used to reject a reading that follows a
 * first-split crossing by too long to be part of the same run — a car that
 * crossed twenty minutes ago is not the one the radar just saw.
 *
 * 100 seconds, matching the harness this replaces.
 */
export const MAX_RUN_MICROS = 100_000_000

const HEATS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export interface RunCandidate {
  heat: number
  car: number
  /** C_HOUR2 of the first-split crossing, microseconds since midnight */
  interMicros: number
  /** C_HOUR2 of that car's next finish, if it has one yet */
  finishMicros: number | null
}

export interface AttributedRun {
  heat: number
  car: number
}

/**
 * Picks the run a reading belongs to from the candidates found in each heat.
 *
 * The right candidate is the one whose first-split crossing is closest before
 * the reading: that is the car on course at that moment. A candidate is only
 * credible if the reading falls inside the run — before the car finished, and
 * not so long after the split that the run must already be over.
 *
 * Kept pure so the rules can be tested without a timing database.
 */
export function chooseRun(
  candidates: RunCandidate[],
  radarMicros: number,
): AttributedRun | null {
  const credible = candidates.filter((candidate) => {
    if (candidate.interMicros > radarMicros) return false

    // The reading must precede the finish: a car that had already finished
    // cannot be the one passing the trap
    if (candidate.finishMicros !== null) {
      if (candidate.finishMicros <= radarMicros) return false
      return candidate.finishMicros - candidate.interMicros < MAX_RUN_MICROS
    }

    // No finish recorded yet — accept only while the run could still be running
    return radarMicros - candidate.interMicros < MAX_RUN_MICROS
  })

  if (credible.length === 0) return null

  const best = credible.reduce((a, b) => (b.interMicros > a.interMicros ? b : a))
  return { heat: best.heat, car: best.car }
}

/** Reads C_HOUR2, which the timing software stores as a numeric string */
const toMicros = (value: unknown): number | null => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Finds the candidate run in one heat: the last car to cross the first split
 * before the reading, and that car's next finish if it has one.
 *
 * Table names are interpolated because they vary per heat; `heat` comes from a
 * fixed list of integers, never from input.
 */
async function candidateForHeat(
  heat: number,
  radarMicros: number,
): Promise<RunCandidate | null> {
  if (!eventData) return null

  try {
    const inter = await eventData.$queryRawUnsafe<
      { C_NUM: number | null; C_HOUR2: string | null }[]
    >(
      `SELECT C_NUM, C_HOUR2 FROM TTIMERECORDS_HEAT${heat}_INTER1
       WHERE C_STATUS = 0 AND C_NUM IS NOT NULL
         AND CAST(C_HOUR2 AS INTEGER) <= ?
       ORDER BY CAST(C_HOUR2 AS INTEGER) DESC LIMIT 1`,
      radarMicros,
    )

    const car = inter[0]?.C_NUM
    const interMicros = toMicros(inter[0]?.C_HOUR2)
    if (car == null || interMicros === null) return null

    const finish = await eventData.$queryRawUnsafe<{ C_HOUR2: string | null }[]>(
      `SELECT C_HOUR2 FROM TTIMERECORDS_HEAT${heat}_FINISH
       WHERE C_NUM = ? AND CAST(C_HOUR2 AS INTEGER) > ?
       ORDER BY CAST(C_HOUR2 AS INTEGER) ASC LIMIT 1`,
      car,
      radarMicros,
    )

    return {
      heat,
      car,
      interMicros,
      finishMicros: finish.length > 0 ? toMicros(finish[0].C_HOUR2) : null,
    }
  } catch (error) {
    // A heat that has not run yet has no table; that is not an error
    logger.debug(`Heat ${heat} unavailable for attribution: ${error}`)
    return null
  }
}

/**
 * Finds the run under way at `daySecs` (seconds since local midnight), or null
 * when no run can credibly claim the reading — a warm-up lap, a reading between
 * runs, or a message so late that the timing data has moved on.
 */
export async function findRunForTimestamp(
  daySecs: number,
): Promise<AttributedRun | null> {
  const radarMicros = daySecs * MICROS_PER_SECOND

  const candidates = (
    await Promise.all(HEATS.map((heat) => candidateForHeat(heat, radarMicros)))
  ).filter((candidate): candidate is RunCandidate => candidate !== null)

  const run = chooseRun(candidates, radarMicros)

  if (!run) {
    logger.info(
      `No run matches a reading at ${daySecs}s; it is kept unattributed`,
    )
  }

  return run
}
