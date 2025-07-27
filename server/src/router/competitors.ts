import { initTRPC } from '@trpc/server';
import { CompetitorList } from './objects.js';
import { getCompetitorJSON } from './shared.js';

const t = initTRPC.create();

export const competitors = t.router({
  list: t.procedure
    .output(CompetitorList)
    .query(() => getCompetitorJSON()),
});
