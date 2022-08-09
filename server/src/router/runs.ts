import { router } from '@trpc/server'
import { z } from 'zod'

import { eventData } from './shared'

export const runs = router().query('count', {
  output: z.number(),
  resolve: async (req) => {
    let heats = []

    try {
      heats.push(await eventData.tTIMEINFOS_HEAT1.count())
      heats.push(await eventData.tTIMEINFOS_HEAT2.count())
      heats.push(await eventData.tTIMEINFOS_HEAT3.count())
      heats.push(await eventData.tTIMEINFOS_HEAT4.count())
      heats.push(await eventData.tTIMEINFOS_HEAT5.count())
      heats.push(await eventData.tTIMEINFOS_HEAT6.count())
      heats.push(await eventData.tTIMEINFOS_HEAT7.count())
      heats.push(await eventData.tTIMEINFOS_HEAT8.count())
      heats.push(await eventData.tTIMEINFOS_HEAT9.count())
    } catch (e) {}

    return heats.filter((cars) => cars > 0).length
  },
})
