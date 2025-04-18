import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { warn } from 'winston';

import { event, eventData } from './shared';
import { getCurrentHeat, getHeatInterTableKey } from '../utils';

const t = initTRPC.create();

export async function getCurrentCompetitor() {
  if (!event || !eventData) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Event database not found',
    });
  }

  try {
    const currentHeat = await getCurrentHeat();
    const heatInterTable = eventData[getHeatInterTableKey(currentHeat)];

    const competitorQuery = await heatInterTable.findMany({
      select: {
        C_NUM: true,
        C_HOUR2: true,
      },
      where: {
        OR: [
          { C_STATUS: 0 },
          { C_STATUS: 65536 },
        ],
        C_NUM: { not: 0 },
      },
      orderBy: {
        C_HOUR2: 'desc',
      },
      take: 1,
    });

    return competitorQuery[0]?.C_NUM || undefined;
  } catch (e) {
    warn(`Error getting current competitor: ${e}`);
    return undefined; // Add fallback return
  }
}

export const currentCompetitor = t.router({
  number: t.procedure
    .output(z.number().optional())
    .query(() => getCurrentCompetitor()),
});

export type GetCurrentCompetitorReturn = ReturnType<typeof getCurrentCompetitor>;
