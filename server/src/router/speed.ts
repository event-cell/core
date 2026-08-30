import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { getActiveSource, getDisplaySpeed, getSourceStatus } from '../radar/source.js'

const t = initTRPC.create()

export const speed = t.router({
  /**
   * The speed to show for the run currently on course, or null when there is
   * nothing to show.
   *
   * Both sources withhold a reading that belongs to an earlier run, so a car
   * that has started but not yet reached the trap never inherits the previous
   * car's speed. See source.ts for how each does it.
   */
  current: t.procedure
    .output(
      z.object({
        speed: z.number().nullable(),
        source: z.enum(['mqtt', 'websocket', 'none']),
        connected: z.boolean(),
      }),
    )
    .query(async () => {
      const status = getSourceStatus()
      const source = getActiveSource()
      const connected =
        source === 'mqtt' ? status.mqtt.connected : status.websocket.connected

      return { speed: await getDisplaySpeed(), source, connected }
    }),

  /** Both sources' connection state, for the admin page */
  status: t.procedure
    .output(
      z.object({
        active: z.enum(['mqtt', 'websocket', 'none']),
        mqtt: z.object({
          connected: z.boolean(),
          url: z.string(),
          topic: z.string(),
          lastMessageAt: z.number().nullable(),
          lastError: z.string().nullable(),
        }),
        websocket: z.object({
          connected: z.boolean(),
          url: z.string(),
          lastMessageAt: z.number().nullable(),
          lastError: z.string().nullable(),
        }),
      }),
    )
    .query(() => getSourceStatus()),
})
