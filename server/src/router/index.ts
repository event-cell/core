import { router } from '@trpc/server'

import { competitors } from './competitors'
import { configRoute } from './config'
import { runs } from './runs'

export const trpcRouter = router()
  .merge('competitors.', competitors)
  .merge('runs.', runs)
  .merge('config.', configRoute)

export type TRPCRouter = typeof trpcRouter
