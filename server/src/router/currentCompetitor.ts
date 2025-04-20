import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { warn } from 'winston';

import { event, eventData } from './shared.js';
import { getCurrentHeat, getHeatInterTableKey } from '../utils/index.js';

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

    const competitorQuery = await (heatInterTable as any).findMany({
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

    return competitorQuery[0]?.C_NUM || 1;
  } catch (e) {
    warn(`Error getting current competitor: ${e}`);
    return 1;
  }
}

export const currentCompetitor = t.router({
  number: t.procedure
    .output(z.number())
    .query(() => getCurrentCompetitor()),
});

export type GetCurrentCompetitorReturn = number;
