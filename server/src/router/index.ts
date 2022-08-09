import { router } from '@trpc/server'

import { competitors } from './competitors'
import { runs } from './runs'

export const trpcRouter = router()
  .merge('competitors.', competitors)
  .merge('runs.', runs)

export type TRPCRouter = typeof trpcRouter
