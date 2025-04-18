import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { setupLogger } from '../utils';
const logger = setupLogger('router/config');

import { config, ConfigType } from '../config';
import { getEventDatabases } from '../dbUtils';
import { setNewEvent } from './shared';

// ✅ Initialize tRPC
const t = initTRPC.create();

export const configRoute = t.router({
  eventName: t.procedure
    .output(z.string())
    .query(() => config.eventName),

  eventId: t.procedure
    .output(z.string())
    .query(() => config.eventId),

  get: t.procedure
    .output(ConfigType)
    .query(() => {
      logger.warn('TODO: config.get should be protected by authentication');
      return config.asJSON();
    }),

  set: t.procedure
    .input(ConfigType)
    .mutation(({ input }) => {
      logger.warn('TODO: config.set should be protected by authentication');

      config.set(input);
      config.storeConfig();

      if (input.eventId) {
        setNewEvent(getEventDatabases(input.eventId));
      }

      return config.asJSON();
    }),
});
