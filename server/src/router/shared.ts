import { config } from '../config.js'
import { EventDB, getEventDatabases } from '../dbUtils.js'
import { TRPCError } from '@trpc/server'
import { CompetitorList, TimeInfoList } from './objects.js'
import { nullToUndefined, setupLogger } from '../utils/index.js'
import { getPersonalBestSectors } from '../utils/competitors.js'

const logger = setupLogger('router/shared')

export let { event, eventData, online } = getEventDatabases(config.eventId)

export function setNewEvent(eventDB: EventDB) {
  event = eventDB.event
  eventData = eventDB.eventData
  online = eventDB.online
}

export async function getCompetitorJSON() {
  let tCOMPETITORSTable
  const heats = []

  if (!event || !eventData) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Event database not found',
    })
  }

  try {
    tCOMPETITORSTable = await event.tCOMPETITORS.findMany()
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to load competitor list',
      // optional: pass the original error to retain stack trace
      cause: e,
    })
  }

  // Each heat is read on its own: an event that has not run all nine heats yet
  // throws on the missing tables, and sharing one try would silently drop every
  // heat after the first failure — competitors would come back missing runs.
  // Typed by the shape used here: the nine delegates are distinct Prisma types,
  // and their union is not callable
  const heatTables: { findMany: () => Promise<any[]> }[] = [
    eventData.tTIMEINFOS_HEAT1,
    eventData.tTIMEINFOS_HEAT2,
    eventData.tTIMEINFOS_HEAT3,
    eventData.tTIMEINFOS_HEAT4,
    eventData.tTIMEINFOS_HEAT5,
    eventData.tTIMEINFOS_HEAT6,
    eventData.tTIMEINFOS_HEAT7,
    eventData.tTIMEINFOS_HEAT8,
    eventData.tTIMEINFOS_HEAT9,
  ]

  for (const [index, table] of heatTables.entries()) {
    try {
      heats.push(await table.findMany())
    } catch (e) {
      logger.debug(`Heat ${index + 1} unavailable: ${e}`)
      heats.push([])
    }
  }

  const competitors: CompetitorList = await Promise.all(tCOMPETITORSTable.map(async (competitor: any) => {
    // Check if C_I29 has a value, if not fall back to C_SERIE
    let className = competitor.C_I29 || competitor.C_SERIE || 'N/A';

    return {
      number: competitor.C_NUM || -1,
      lastName: competitor.C_FIRST_NAME || 'N/A',
      firstName: competitor.C_LAST_NAME || 'N/A',
      class: className,
      classIndex: competitor.C_I21 || 0,
      vehicle: competitor.C_COMMITTEE || 'N/A',
      classRecord: competitor.C_TEAM || '0.00',
      club: nullToUndefined(competitor.C_CLUB),
      special: nullToUndefined(competitor.C_I28),
      miscAward: nullToUndefined(competitor.C_I30),
      times: [],
      outright: -1,
    };
  }));

  for (let i = 0; i < competitors.length; i++) {
    heats.forEach((heat, index) => {
      if (heat.length === 0) {
        return
      }

      const run: TimeInfoList = heat
        .filter((timedRun: any) => competitors[i].number === timedRun.C_NUM)
        .map((timedRun: any) => ({
          run: index + 1,
          status: timedRun.C_STATUS || 0,
          ...(timedRun.C_STATUS === 3
            ? { time: 0, split1: 0, split2: 0 }
            : {
              time: timedRun.C_TIME || 0,
              split1: timedRun.C_INTER1 || 0,
              split2: timedRun.C_INTER2 || 0,
            }),
        }))
      competitors[i].times = [...competitors[i].times, ...run]
    })
  }

  let position = 1
  return competitors
    .map((c) => ({
      c,
      bestSectors: getPersonalBestSectors(c),
    }))
    .sort((a, b) => a.bestSectors.bestFinish - b.bestSectors.bestFinish)
    .map((c, index) => {
      if (c.c.times.some((time) => time && time.time > 0)) {
        const result = { ...c.c, outright: position }
        position++
        return result
      } else {
        return c.c
      }
    })
}
export type GetCompetitorJsonReturn = ReturnType<typeof getCompetitorJSON>

