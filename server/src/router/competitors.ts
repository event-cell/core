import { initTRPC } from '@trpc/server';
import { CompetitorList } from './objects';
import { getCompetitorJSON } from './shared';

const t = initTRPC.create();

export const competitors = t.router({
  list: t.procedure
    .output(CompetitorList)
    .query(() => getCompetitorJSON()),
});
