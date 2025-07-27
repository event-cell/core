import { z } from 'zod'
import { initTRPC } from '@trpc/server'
import { setupLogger } from '../utils/index.js'
const logger = setupLogger('router/config')

import { config, ConfigType } from '../config.js'
import { getEventDatabases } from '../dbUtils.js'
import { setNewEvent } from '../router/shared.js'
import {
  syncLiveTimingData,
  generateEventsMetadata,
} from '../scheduledTasks/index.js'
import dayjs from 'dayjs'

// ✅ Initialize tRPC
const t = initTRPC.create()

// Helper function to get event date in YYYY-MM-DD format
async function getEventDateFormatted() {
  try {
    // Get the event database
    const { event } = getEventDatabases(config.eventId)

    // Query the TPARAMETERS table for the DATE parameter
    const dateParam = await event.tPARAMETERS.findFirst({
      where: { C_PARAM: 'DATE' },
    })

    if (dateParam && dateParam.C_VALUE) {
      // Convert Excel serial date to JavaScript date
      // Excel dates are number of days since January 1, 1900
      // JavaScript dates are milliseconds since January 1, 1970
      const excelDate = Number(dateParam.C_VALUE)
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000)

      // Format the date in YYYY-MM-DD format
      return dayjs(jsDate).format('YYYY-MM-DD')
    } else {
      logger.warn('No event date found in database, using current date')
      return dayjs().format('YYYY-MM-DD')
    }
  } catch (error) {
    logger.error('Error getting event date from database:', error)
    return dayjs().format('YYYY-MM-DD')
  }
}

export const configRoute = t.router({
  eventName: t.procedure.output(z.string()).query(() => config.eventName),

  eventId: t.procedure.output(z.string()).query(() => config.eventId),

  get: t.procedure
    .output(
      z.object({
        eventId: z.string(),
        eventName: z.string(),
        eventDate: z.string(),
        uploadLiveTiming: z.boolean(),
        liveTimingOutputPath: z.string(),
      }),
    )
    .query(async () => {
      logger.warn('TODO: config.get should be protected by authentication')
      const eventDate = await getEventDateFormatted()

      // Format the event name with date first
      let formattedEventName = ''
      try {
        // Get the event database
        const { event } = getEventDatabases(config.eventId)

        // Query the TPARAMETERS table for the DATE parameter
        const dateParam = await event.tPARAMETERS.findFirst({
          where: { C_PARAM: 'DATE' },
        })

        // Query the TPARAMETERS table for the TITLE2 parameter
        const title2Param = await event.tPARAMETERS.findFirst({
          where: { C_PARAM: 'TITLE2' },
        })

        // Get the title2 value or use a default
        const title2 = (title2Param?.C_VALUE || 'Event') as string

        if (dateParam && dateParam.C_VALUE) {
          // Convert Excel serial date to JavaScript date
          // Excel dates are number of days since January 1, 1900
          // JavaScript dates are milliseconds since January 1, 1970
          const excelDate = Number(dateParam.C_VALUE)
          const jsDate = new Date((excelDate - 25569) * 86400 * 1000)

          // Format the date in a longer format (e.g., "January 15, 2023")
          const formattedDate = dayjs(jsDate).format('MMMM D, YYYY')

          // Combine date and title2 (date first)
          formattedEventName = `${formattedDate}: ${title2}`
        } else {
          logger.warn('No event date found in database, using current date')
          const currentDate = dayjs().format('MMMM D, YYYY')
          formattedEventName = `${currentDate}: ${title2}`
        }
      } catch (error) {
        logger.error('Error getting event date from database:', error)
        const currentDate = dayjs().format('MMMM D, YYYY')
        formattedEventName = currentDate
      }

      return {
        eventId: config.eventId,
        eventName: formattedEventName,
        eventDate: eventDate,
        uploadLiveTiming: config.uploadLiveTiming,
        liveTimingOutputPath: config.liveTimingOutputPath,
      }
    }),

  set: t.procedure
    .input(ConfigType)
    .output(
      z.object({
        eventName: z.string(),
        eventId: z.string(),
        eventDate: z.string(),
        uploadLiveTiming: z.boolean(),
        liveTimingOutputPath: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      logger.warn('TODO: config.set should be protected by authentication')

      const wasUploadEnabled = config.uploadLiveTiming
      const oldEventId = config.eventId

      config.set(input)
      config.storeConfig()

      // Get the event name
      let eventName = ''
      let eventDate = ''
      try {
        // Check if eventId is defined before calling getEventDatabases
        if (input.eventId) {
          // Get the event database
          const { event } = getEventDatabases(input.eventId)

          // Query the TPARAMETERS table for the DATE parameter
          const dateParam = await event.tPARAMETERS.findFirst({
            where: { C_PARAM: 'DATE' },
          })

          // Query the TPARAMETERS table for the TITLE2 parameter
          const title2Param = await event.tPARAMETERS.findFirst({
            where: { C_PARAM: 'TITLE2' },
          })

          // Get the title2 value or use a default
          const title2 = (title2Param?.C_VALUE || 'Event') as string

          if (dateParam && dateParam.C_VALUE) {
            // Convert Excel serial date to JavaScript date
            // Excel dates are number of days since January 1, 1900
            // JavaScript dates are milliseconds since January 1, 1970
            const excelDate = Number(dateParam.C_VALUE)
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000)

            // Format the date in a longer format (e.g., "January 15, 2023")
            const formattedDate = dayjs(jsDate).format('MMMM D, YYYY')

            // Format the date in YYYY-MM-DD format
            eventDate = dayjs(jsDate).format('YYYY-MM-DD')

            // Combine date and title2 (date first)
            eventName = `${formattedDate}: ${title2}`
          } else {
            logger.warn('No event date found in database, using current date')
            const currentDate = dayjs().format('MMMM D, YYYY')
            eventDate = dayjs().format('YYYY-MM-DD')
            eventName = `${currentDate}: ${title2}`
          }
        } else {
          logger.warn('No event ID provided, using current date')
          const currentDate = dayjs().format('MMMM D, YYYY')
          eventDate = dayjs().format('YYYY-MM-DD')
          eventName = currentDate
        }
      } catch (error) {
        logger.error('Error getting event date from database:', error)
        const currentDate = dayjs().format('MMMM D, YYYY')
        eventDate = dayjs().format('YYYY-MM-DD')
        eventName = `${currentDate}`
      }

      // Check if eventId was changed
      if (input.eventId && input.eventId !== oldEventId) {
        logger.info(
          `Event ID changed from ${oldEventId} to ${input.eventId}, recreating directory and triggering sync`,
        )

        // Set new event database
        setNewEvent(getEventDatabases(input.eventId))
      } else if (input.eventId) {
        // Just set the new event database without recreating directory
        setNewEvent(getEventDatabases(input.eventId))
      }

      return {
        eventName,
        eventId: config.eventId,
        eventDate: eventDate,
        uploadLiveTiming: config.uploadLiveTiming,
        liveTimingOutputPath: config.liveTimingOutputPath,
      }
    }),
})
