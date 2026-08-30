// Attaches recorded speeds to a competitor list.
//
// Deliberately not done inside getCompetitorJSON(): shared.ts opens the event
// databases at module load, and the speeds store reaches back into it through
// attribution and runTracker. Importing the store from shared.ts would close
// that loop and leave a binding uninitialised — the failure this codebase has
// already been bitten by. Callers enrich after the fact instead.

import type { CompetitorList } from '../router/objects.js'
import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import { getEventSpeeds } from './store.js'

const logger = setupLogger('radar/enrich')

/**
 * Returns the list with each run's speed filled in where one was recorded.
 *
 * `car_speeds` is keyed by heat, and a run's number *is* its heat, so the two
 * line up directly. A speeds database that cannot be read leaves the list
 * untouched rather than failing it — the boards must keep showing times.
 */
export async function attachSpeeds(
  competitors: CompetitorList,
): Promise<CompetitorList> {
  let speeds: Record<string, number>

  try {
    speeds = await getEventSpeeds(config.eventId)
  } catch (error) {
    logger.warn(`Could not read speeds, competitor list served without them: ${error}`)
    return competitors
  }

  if (Object.keys(speeds).length === 0) return competitors

  return competitors.map((competitor) => ({
    ...competitor,
    times: competitor.times.map((time) =>
      time ? { ...time, speed: speeds[`${time.run}:${competitor.number}`] } : time,
    ),
  }))
}
