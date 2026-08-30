// Tracks which run is currently on course, so radar passes can be attributed to
// a competitor and so a stale speed can be blanked the moment a new run starts.

import { getCurrentHeatOrNull } from '../utils/index.js'
import { getCurrentCompetitorOrNull } from '../router/currentCompetitor.js'
import { setupLogger } from '../utils/index.js'

const logger = setupLogger('radar/runTracker')

export interface CurrentRun {
  heat: number
  competitor: number
  /** Identity of the run: changes when either the heat or the competitor changes */
  runKey: string
  /** When this run identity was first observed */
  changedAt: number
}

/**
 * How long a cached run stays usable after the last successful read. The timing
 * software writes to the .scdb files constantly, so a brief failure is normal and
 * the previous answer is still right. A sustained outage is not: without this,
 * every pass for the rest of the event would be filed against one stale car.
 */
const RUN_STALE_MS = 30_000

let current: CurrentRun | null = null
let observedAt = 0
let unknownLogged = false

/**
 * Reads the run currently on course, or null when it cannot be determined.
 *
 * The `OrNull` lookups are used deliberately: the plain ones fall back to heat 1
 * and competitor 1 when a query fails, which is fine for a display but would file
 * a recorded speed against the wrong car.
 */
export async function getCurrentRun(): Promise<CurrentRun | null> {
  try {
    const [heat, competitor] = await Promise.all([
      getCurrentHeatOrNull(),
      getCurrentCompetitorOrNull(),
    ])

    // Heat 0 means the timing software has not started a heat yet
    if (heat === null || heat < 1 || competitor === null) {
      if (!unknownLogged) {
        logger.warn(
          `Current run unknown (heat ${heat ?? 'unknown'}, competitor ${competitor ?? 'unknown'})`,
        )
        unknownLogged = true
      }
      return lastKnownRun()
    }

    const runKey = `${heat}:${competitor}`

    if (!current) {
      // The first run we see has not "changed" — we have no idea when it began.
      // Timestamping it now would withhold the speed of a pass already under
      // way, which is every first car after a restart, so treat it as
      // long-standing instead.
      current = { heat, competitor, runKey, changedAt: 0 }
      logger.info(`Run on course: heat ${heat}, competitor ${competitor}`)
    } else if (current.runKey !== runKey) {
      current = { heat, competitor, runKey, changedAt: Date.now() }
      logger.info(`Run changed to heat ${heat}, competitor ${competitor}`)
    }

    observedAt = Date.now()
    unknownLogged = false
    return current
  } catch (error) {
    if (!unknownLogged) {
      logger.warn(`Failed to read current run: ${error}`)
      unknownLogged = true
    }
    return lastKnownRun()
  }
}

/** The last successfully read run, while it is still recent enough to trust */
function lastKnownRun(): CurrentRun | null {
  if (!current) return null

  return Date.now() - observedAt < RUN_STALE_MS ? current : null
}
