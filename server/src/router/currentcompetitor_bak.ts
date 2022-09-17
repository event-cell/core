import { router, TRPCError } from '@trpc/server'

import { event, eventData } from './shared'
import { Competitor, CompetitorList, TimeInfoList } from './objects'
import { nullToUndefined } from '../utils'

export const currentcompetitor = router().query('currentRun', {
  output: Competitor,
  resolve: async function () {
    let lastStartQuery
    let currentRun
    let heats = []
    let returnCompetitor: Competitor = {
      number: -1,
      firstName: 'N/A',
      lastName: 'N/A',
      class: 'N/A',
      classIndex: 0,
      vehicle: 'N/A',
      classRecord: '0.00',
      special: undefined,
      miscAward: undefined,
      times: [],
    }

    if (!event || !eventData) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Event database not found',
      })
    }

    try {
      lastStartQuery = await eventData.tTIMERECORDS_HEAT1_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT2_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT3_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT4_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT5_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT6_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT7_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT8_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
      lastStartQuery = await eventData.tTIMERECORDS_HEAT9_START.findMany({
        select: {
          C_NUM: true,
        },
        orderBy: {
          C_LINE: 'desc',
        },
        take: 1,
      })
      if (lastStartQuery.length === 1) {
        currentRun = lastStartQuery
      }
    } catch (e) {}

    if (currentRun) {
      let currentCompetitorNumber: number = [...currentRun][0].C_NUM || 9999
      let currentCompetitorQuery = await event.tCOMPETITORS.findMany({
        where: {
          C_NUM: currentCompetitorNumber,
        },
      })
      try {
        heats.push(
          await eventData.tTIMEINFOS_HEAT1.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT2.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT3.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT4.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT5.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT6.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT7.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT8.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
        heats.push(
          await eventData.tTIMEINFOS_HEAT9.findMany({
            where: {
              C_NUM: currentCompetitorNumber,
            },
          })
        )
      } catch (e) {}

      let currentCompetitor: CompetitorList = currentCompetitorQuery.map(
        (competitor) => ({
          number: competitor.C_NUM || -1,
          firstName: competitor.C_FIRST_NAME || 'N/A',
          lastName: competitor.C_LAST_NAME || 'N/A',
          class: competitor.C_SERIE || 'N/A',
          classIndex: competitor.C_I21 || 0,
          vehicle: competitor.C_COMMITTEE || 'N/A',
          classRecord: competitor.C_TEAM || '0.00',
          special: nullToUndefined(competitor.C_I28),
          miscAward: nullToUndefined(competitor.C_I30),
          times: [],
        })
      )
      for (let i = 0; i < currentCompetitor.length; i++) {
        heats.forEach((heat, index) => {
          if (heat.length === 0) {
            return
          }

          const run: TimeInfoList = heat
            .filter(
              (timedRun) => currentCompetitor[i].number === timedRun.C_NUM
            )
            .map((timedRun) => ({
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
          currentCompetitor[i].times = [...currentCompetitor[i].times, ...run]
        })
      }
      returnCompetitor = currentCompetitor[0]
      return returnCompetitor
    }
    return returnCompetitor
  },
})
