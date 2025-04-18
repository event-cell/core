import { initTRPC } from '@trpc/server'

import { competitors } from './competitors'
import { configRoute } from './config'
import { runs } from './runs'
import { currentCompetitor } from './currentCompetitor'
import { endOfDayResults } from './endOfDayResults'

const t = initTRPC.create(); // Optionally pass context typing here

export const trpcRouter = t.router({
  competitors: competitors,
  runs: runs,
  config: configRoute,
  currentcompetitor: currentCompetitor,
  endofdayresults: endOfDayResults,
});

export type TRPCRouter = typeof trpcRouter;