import { router } from '@trpc/server'

import { competitors } from './competitors'
import { configRoute } from './config'
import { runs } from './runs'
import { currentCompetitor } from './currentCompetitor'
import { endOfDayResults } from './endOfDayResults'

export const trpcRouter = router()
  .merge('competitors.', competitors)
  .merge('runs.', runs)
  .merge('config.', configRoute)
  .merge('currentcompetitor.', currentCompetitor)
  .merge('endofdayresults.', endOfDayResults)

export type TRPCRouter = typeof trpcRouter
