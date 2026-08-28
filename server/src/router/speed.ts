import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { radarClient, selectDisplaySpeed } from '../radar/client.js'
import { getCurrentRun } from '../radar/runTracker.js'
import { setupLogger } from '../utils/index.js'

const t = initTRPC.create()
const logger = setupLogger('router/speed')

export const speed = t.router({
  /**
   * The speed to show for the run currently on course, or null when there is
   * nothing to show.
   *
   * The radar keeps reporting the last pass it saw, so a car that has started a
   * run but not yet reached the speed trap would otherwise inherit the previous
   * car's speed. A pass only counts once it began after the current run did.
   */
  current: t.procedure
    .output(
      z.object({
        speed: z.number().nullable(),
        passSeq: z.number().nullable(),
        connected: z.boolean(),
      }),
    )
    .query(async () => {
      const { connected } = radarClient.getStatus()
      const pass = radarClient.getCurrentPass()
      const run = await getCurrentRun()
      const speed = selectDisplaySpeed(pass, run)

      if (speed === null) {
        if (pass && run) {
          logger.debug(
            `Withholding pass ${pass.passSeq}: it predates the current run ${run.runKey}`,
          )
        }
        return { speed: null, passSeq: null, connected }
      }

      return { speed, passSeq: pass?.passSeq ?? null, connected }
    }),

  /** Radar connection state, for the admin page */
  status: t.procedure
    .output(
      z.object({
        connected: z.boolean(),
        url: z.string(),
        lastMessageAt: z.number().nullable(),
        lastError: z.string().nullable(),
      }),
    )
    .query(() => radarClient.getStatus()),
})
