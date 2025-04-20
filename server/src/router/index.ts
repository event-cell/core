import { initTRPC } from '@trpc/server'

import { competitors } from './competitors.js'
import { configRoute } from './config.js'
import { runs } from './runs.js'
import { currentCompetitor } from './currentCompetitor.js'
import { endOfDayResults } from './endOfDayResults.js'
import { events } from './events.js'

const t = initTRPC.create(); // Optionally pass context typing here

export const trpcRouter = t.router({
  competitors: competitors,
  runs: runs,
  config: configRoute,
  currentcompetitor: currentCompetitor,
  endofdayresults: endOfDayResults,
  events: events,
});

export type TRPCRouter = typeof trpcRouter;