import { router } from '@trpc/server'

import { competitors } from './competitors'
import { configRoute } from './config'
import { runs } from './runs'
import { currentCompetitor } from './currentCompetitor'

export const trpcRouter = router()
  .merge('competitors.', competitors)
  .merge('runs.', runs)
  .merge('config.', configRoute)
  .merge('currentcompetitor.', currentCompetitor)

export type TRPCRouter = typeof trpcRouter
