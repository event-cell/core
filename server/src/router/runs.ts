import { router } from '@trpc/server'
import { z } from 'zod'

import { getCurrentHeat } from '../utils'

export const runs = router().query('count', {
  output: z.number(),
  resolve: getCurrentHeat,
})
