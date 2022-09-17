import { router, TRPCError } from '@trpc/server'

import { event, eventData } from './shared'
import { z } from 'zod'

export const currentcompetitor = router().query('number', {
  output: z.number(),
  resolve: async function () {
    let lastStartQuery
    let currentCompetitorNumber: number = 0

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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
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
        lastStartQuery.forEach((a) => {
          if (a.C_NUM) {
            currentCompetitorNumber = a.C_NUM
          }
        })
      }
    } catch (e) {}
    return currentCompetitorNumber
  },
})
