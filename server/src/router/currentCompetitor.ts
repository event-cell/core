import { router, TRPCError } from '@trpc/server'

import { event, eventData } from './shared'
import { z } from 'zod'
import { getCurrentHeat, getHeatInterTableKey } from '../utils'
import { warn } from 'winston'

export const currentCompetitor = router().query('number', {
  output: z.number().optional(),
  resolve: async function () {
    if (!event || !eventData) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Event database not found',
      })
    }

    try {
      const currentHeat = await getCurrentHeat()
      const heatInterTable = eventData[getHeatInterTableKey(currentHeat)]

      // Find the competitor with the highest C_HOUR2
      const competitorQuery = await heatInterTable.findMany({
        select: {
          C_NUM: true,
          C_HOUR2: true,
        },
        where: {
          OR: [
            {
              C_STATUS: 0,
            },
            {
              C_STATUS: 65536,
            },
          ],
        },
        orderBy: {
          C_HOUR2: 'desc',
        },
        take: 1,
      })

      return competitorQuery[0].C_NUM || undefined
    } catch (e) {
      warn(`Error getting current competitor: ${e}`)
    }
  },
})
