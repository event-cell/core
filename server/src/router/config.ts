import { router } from '@trpc/server'
import winston from 'winston'
import { z } from 'zod'

import { config, ConfigType } from '../config'
import { getEventDatabases } from '../dbUtils'
import { event, eventData, setNewEvent } from './shared'

export const configRoute = router()
  .query('eventName', { output: z.string(), resolve: () => config.eventName })
  .query('eventId', { output: z.string(), resolve: () => config.eventId })
  .query('get', {
    output: ConfigType,
    resolve: (req) => {
      winston.warn('TODO: config.get should be protected by authentication')
      return config.asJSON()
    },
  })
  .mutation('set', {
    input: ConfigType,
    resolve: (req) => {
      winston.warn('TODO: config.set should be protected by authentication')

      config.set(req.input)
      config.storeConfig()

      // We need to reload the database
      if (req.input.eventId) {
        setNewEvent(getEventDatabases(req.input.eventId))
      }

      return config.asJSON()
    },
  })
