import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { setupLogger } from '../utils';
const logger = setupLogger('router/config');

import { config, ConfigType } from '../config';
import { getEventDatabases } from '../dbUtils';
import { setNewEvent } from './shared';
import { syncLiveTimingData } from '../scheduledTasks/scheduledTasks';
import dayjs from 'dayjs';

// ✅ Initialize tRPC
const t = initTRPC.create();

export const configRoute = t.router({
  eventName: t.procedure
    .output(z.string())
    .query(() => config.eventName),

  eventId: t.procedure
    .output(z.string())
    .query(() => config.eventId),

  getEventDate: t.procedure
    .output(z.string())
    .query(async () => {
      try {
        // Get the event database
        const { event } = getEventDatabases(config.eventId);
        
        // Query the TPARAMETERS table for the DATE parameter
        const dateParam = await event.tPARAMETERS.findFirst({
          where: { C_PARAM: 'DATE' }
        });
        
        // Query the TPARAMETERS table for the TITLE2 parameter
        const title2Param = await event.tPARAMETERS.findFirst({
          where: { C_PARAM: 'TITLE2' }
        });
        
        // Get the title2 value or use a default
        const title2 = (title2Param?.C_VALUE || 'Event') as string;
        
        if (dateParam && dateParam.C_VALUE) {
          // Convert Excel serial date to JavaScript date
          // Excel dates are number of days since January 1, 1900
          // JavaScript dates are milliseconds since January 1, 1970
          const excelDate = Number(dateParam.C_VALUE);
          const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
          
          // Format the date in a longer format (e.g., "January 15, 2023")
          const formattedDate = dayjs(jsDate).format('MMMM D, YYYY');
          
          // Combine title2 and date
          const eventName = `${formattedDate}: ${title2} `;
          
          logger.info(`Found event date in database: ${eventName}`);
          return eventName;
        } else {
          logger.warn('No event date found in database, using current date');
          const currentDate = dayjs().format('MMMM D, YYYY');
          return `${currentDate}: ${title2}`;
        }
      } catch (error) {
        logger.error('Error getting event date from database:', error);
        const currentDate = dayjs().format('MMMM D, YYYY');
        return `${currentDate}`;
      }
    }),

  get: t.procedure
    .output(z.object({
      eventId: z.string(),
      eventName: z.string(),
      uploadLiveTiming: z.boolean(),
      liveTimingOutputPath: z.string()
    }))
    .query(() => {
      logger.warn('TODO: config.get should be protected by authentication');
      return {
        eventId: config.eventId,
        eventName: config.eventName,
        uploadLiveTiming: config.uploadLiveTiming,
        liveTimingOutputPath: config.liveTimingOutputPath
      };
    }),

  set: t.procedure
    .input(ConfigType)
    .output(z.object({
      eventName: z.string(),
      eventId: z.string(),
      uploadLiveTiming: z.boolean(),
      liveTimingOutputPath: z.string()
    }))
    .mutation(async ({ input }) => {
      logger.warn('TODO: config.set should be protected by authentication');

      const wasUploadEnabled = config.uploadLiveTiming;
      const oldEventId = config.eventId;
      
      config.set(input);
      config.storeConfig();

      // Get the event name
      let eventName = '';
      try {
        // Check if eventId is defined before calling getEventDatabases
        if (input.eventId) {
          // Get the event database
          const { event } = getEventDatabases(input.eventId);
          
          // Query the TPARAMETERS table for the DATE parameter
          const dateParam = await event.tPARAMETERS.findFirst({
            where: { C_PARAM: 'DATE' }
          });
          
          // Query the TPARAMETERS table for the TITLE2 parameter
          const title2Param = await event.tPARAMETERS.findFirst({
            where: { C_PARAM: 'TITLE2' }
          });
          
          // Get the title2 value or use a default
          const title2 = (title2Param?.C_VALUE || 'Event') as string;
          
          if (dateParam && dateParam.C_VALUE) {
            // Convert Excel serial date to JavaScript date
            // Excel dates are number of days since January 1, 1900
            // JavaScript dates are milliseconds since January 1, 1970
            const excelDate = Number(dateParam.C_VALUE);
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
            
            // Format the date in a longer format (e.g., "January 15, 2023")
            const formattedDate = dayjs(jsDate).format('MMMM D, YYYY');
            
            // Combine title2 and date
            eventName = `${title2}: ${formattedDate}`;
          } else {
            logger.warn('No event date found in database, using current date');
            const currentDate = dayjs().format('MMMM D, YYYY');
            eventName = `${currentDate}: ${title2}`;
          }
        } else {
          logger.warn('No event ID provided, using current date');
          const currentDate = dayjs().format('MMMM D, YYYY');
          eventName = currentDate;
        }
      } catch (error) {
        logger.error('Error getting event date from database:', error);
        const currentDate = dayjs().format('MMMM D, YYYY');
        eventName = `${currentDate}`;
      }

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

      return {
        eventName,
        eventId: config.eventId,
        uploadLiveTiming: config.uploadLiveTiming,
        liveTimingOutputPath: config.liveTimingOutputPath
      };
    }),
});
