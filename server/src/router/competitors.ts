import { router, TRPCError } from '@trpc/server'
import { z } from 'zod'

import { nullToUndefined } from '../utils'
import { event, eventData } from './shared'

const TimeInfo = z
  .object({
    run: z.number(),
    status: z.number(),
    time: z.number(),
    split1: z.number(),
    split2: z.number(),
  })
  .optional()

const TimeInfoList = z.array(TimeInfo)
export type TimeInfo = z.infer<typeof TimeInfo>
export type TimeInfoList = z.infer<typeof TimeInfoList>

const Competitor = z.object({
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  class: z.string(),
  vehicle: z.string(),
  classRecord: z.string(),
  special: z.optional(z.string()),
  miscAward: z.optional(z.string()),
  times: TimeInfoList,
})
const CompetitorList = z.array(Competitor)
export type Competitor = z.infer<typeof Competitor>
export type CompetitorList = z.infer<typeof CompetitorList>

export const competitors = router().query('list', {
  output: CompetitorList,
  resolve: async function () {
    let tCOMPETITORSTable
    let heats = []

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

    try {
      heats.push(await eventData.tTIMEINFOS_HEAT1.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT2.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT3.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT4.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT5.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT6.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT7.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT8.findMany())
      heats.push(await eventData.tTIMEINFOS_HEAT9.findMany())
    } catch (e) {}

    let competitors: CompetitorList = tCOMPETITORSTable.map((competitor) => ({
      number: competitor.C_NUM || -1,
      firstName: competitor.C_FIRST_NAME || 'N/A',
      lastName: competitor.C_LAST_NAME || 'N/A',
      class: competitor.C_SERIE || 'N/A',
      vehicle: competitor.C_COMMITTEE || 'N/A',
      classRecord: competitor.C_TEAM || '0.00',
      special: nullToUndefined(competitor.C_I28),
      miscAward: nullToUndefined(competitor.C_I30),
      times: [],
    }))

    for (let i = 0; i < competitors.length; i++) {
      heats.forEach((heat, index) => {
        if (heat.length === 0) {
          return
        }

        const run: TimeInfoList = heat
          .filter((timedRun) => competitors[i].number === timedRun.C_NUM)
          .map((timedRun) => ({
            run: index + 1,
            status: timedRun.C_STATUS || 0,
            ...(timedRun.C_STATUS === 3
              ? { time: 0 }
              : { time: timedRun.C_TIME || 0 }),
            ...(timedRun.C_STATUS === 3
              ? { split1: 0 }
              : { split1: timedRun.C_INTER1 || 0 }),
            ...(timedRun.C_STATUS === 3
              ? { split2: 0 }
              : { split2: timedRun.C_INTER2 || 0 }),
          }))
        competitors[i].times = [...competitors[i].times, ...run]
      })
    }

    return competitors
  },
})
