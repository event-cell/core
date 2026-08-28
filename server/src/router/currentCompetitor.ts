import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { setupLogger } from '../utils/index.js'

import { event, eventData } from './shared.js'
import { getCurrentHeat, getHeatInterTableKey } from '../utils/index.js'

const t = initTRPC.create()
const logger = setupLogger('currentCompetitor')

/**
 * The competitor currently on course, or null when that cannot be determined.
 *
 * Callers that must show something use `getCurrentCompetitor()`, which falls back
 * to competitor 1. Callers that record data use this instead, so a database
 * failure is never mistaken for a genuine reading of competitor 1.
 */
export async function getCurrentCompetitorOrNull(): Promise<number | null> {
  if (!event || !eventData) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Event database not found',
    })
  }

  try {
    const currentHeat = await getCurrentHeat()
    const heatInterTable = eventData[getHeatInterTableKey(currentHeat)]

    const competitorQuery = await (heatInterTable as any).findMany({
      select: {
        C_NUM: true,
        C_HOUR2: true,
      },
      where: {
        OR: [{ C_STATUS: 0 }, { C_STATUS: 65536 }],
        C_NUM: { not: 0 },
      },
      orderBy: {
        C_HOUR2: 'desc',
      },
      take: 1,
    })

    return competitorQuery[0]?.C_NUM || null
  } catch (e) {
    logger.warn(`Error getting current competitor: ${e}`)
    return null
  }
}

export async function getCurrentCompetitor() {
  return (await getCurrentCompetitorOrNull()) ?? 1
}

export const currentCompetitor = t.router({
  number: t.procedure.output(z.number()).query(() => getCurrentCompetitor()),
})

export type GetCurrentCompetitorReturn = number
