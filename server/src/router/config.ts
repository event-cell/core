import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { setupLogger } from '../utils';
const logger = setupLogger('router/config');

import { config, ConfigType } from '../config';
import { getEventDatabases } from '../dbUtils';
import { setNewEvent } from './shared';
import { syncLiveTimingData } from '../scheduledTasks/scheduledTasks';

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
    .mutation(async ({ input }) => {
      logger.warn('TODO: config.set should be protected by authentication');

      const wasUploadEnabled = config.uploadLiveTiming;
      const oldEventId = config.eventId;
      
      config.set(input);
      config.storeConfig();

      // Check if eventId was changed
      if (input.eventId && input.eventId !== oldEventId) {
        logger.info(`Event ID changed from ${oldEventId} to ${input.eventId}, recreating directory and triggering sync`);
        
        // Set new event database
        setNewEvent(getEventDatabases(input.eventId));
        
        // If upload is enabled, trigger a sync to recreate and upload the directory
        if (config.uploadLiveTiming) {
          await syncLiveTimingData();
        }
      } else if (input.eventId) {
        // Just set the new event database without recreating directory
        setNewEvent(getEventDatabases(input.eventId));
      }

      // If uploadLiveTiming was just enabled, trigger an immediate sync
      if (!wasUploadEnabled && config.uploadLiveTiming) {
        logger.info('Upload live timing was just enabled, triggering immediate sync');
        await syncLiveTimingData();
      }

      return config.asJSON();
    }),
});
