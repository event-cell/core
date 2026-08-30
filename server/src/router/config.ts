import { z } from 'zod'
import { initTRPC } from '@trpc/server'
import { setupLogger } from '../utils/index.js'
const logger = setupLogger('router/config')

import { config, ConfigType } from '../config.js'
import { getEventDatabases } from '../dbUtils.js'
import { setNewEvent, event, eventData, online } from '../router/shared.js'
import {
  syncLiveTimingData,
  generateEventsMetadata,
} from '../scheduledTasks/index.js'
import dayjs from 'dayjs'
import { exportRefreshConfig } from '../scheduledTasks/utils.js'
import { restartSpeedSources } from '../radar/source.js'
import { resetStore } from '../radar/store.js'

// ✅ Initialize tRPC
const t = initTRPC.create()

// Helper function to get event date in YYYY-MM-DD format
async function getEventDateFormatted() {
  try {
    // The shared client, rather than getEventDatabases(): that constructs three
    // Prisma clients per call and nothing disconnects them

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
        speedMonitorUrl: z.string(),
        speedMqttUrl: z.string(),
        speedMqttTopic: z.string(),
        speedMqttUsername: z.string(),
        speedMqttClientId: z.string(),
        // The password itself is deliberately never returned: /admin and this
        // endpoint are unauthenticated, so a read must not disclose it. The
        // page reports only whether one is stored.
        speedMqttPasswordSet: z.boolean(),
      }),
    )
    .query(async () => {
      logger.warn('TODO: config.get should be protected by authentication')
      const eventDate = await getEventDateFormatted()

      // Format the event name with date first
      let formattedEventName = ''
      try {
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
        speedMonitorUrl: config.speedMonitorUrl,
        speedMqttUrl: config.speedMqttUrl,
        speedMqttTopic: config.speedMqttTopic,
        speedMqttUsername: config.speedMqttUsername,
        speedMqttClientId: config.speedMqttClientId,
        speedMqttPasswordSet: Boolean(config.speedMqttPassword),
      }
    }),

  getDisplayDistribution: t.procedure
    .output(
      z.object({
        maxRowsPerDisplay: z.number(),
      }),
    )
    .query(async () => {
      logger.info('Getting display distribution configuration')

      return config.displayDistribution
    }),

  setDisplayDistribution: t.procedure
    .input(
      z.object({
        maxRowsPerDisplay: z.number().min(1).optional(),
      }),
    )
    .output(
      z.object({
        maxRowsPerDisplay: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      logger.info('Setting display distribution configuration', input)

      // Update the config with new values
      config.set({
        displayDistribution: {
          ...config.displayDistribution,
          ...input,
        },
      })

      // Save to disk
      config.storeConfig()

      return config.displayDistribution
    }),

  getRefreshIntervals: t.procedure
    .output(
      z.object({
        display1: z.number(),
        display2: z.number(),
        display3: z.number(),
        display4: z.number(),
        trackDisplay: z.number(),
        announcer: z.number(),
        fallbackInterval: z.number(),
      }),
    )
    .query(async () => {
      logger.info('Getting refresh intervals configuration')

      return config.refreshIntervals
    }),

  setRefreshIntervals: t.procedure
    .input(
      z.object({
        display1: z.number().min(1).max(300).optional(),
        display2: z.number().min(1).max(300).optional(),
        display3: z.number().min(1).max(300).optional(),
        display4: z.number().min(1).max(300).optional(),
        trackDisplay: z.number().min(1).max(300).optional(),
        announcer: z.number().min(1).max(300).optional(),
        fallbackInterval: z.number().min(60).max(1800).optional(),
      }),
    )
    .output(
      z.object({
        display1: z.number(),
        display2: z.number(),
        display3: z.number(),
        display4: z.number(),
        trackDisplay: z.number(),
        announcer: z.number(),
        fallbackInterval: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      logger.info('Setting refresh intervals configuration', input)

      // Update the config with new values
      config.set({
        refreshIntervals: {
          ...config.refreshIntervals,
          ...input,
        },
      })

      // Save to disk
      config.storeConfig()

      // Export refresh configuration to JSON for live-timing website
      try {
        await exportRefreshConfig()
        logger.info('Successfully exported refresh configuration to JSON')
      } catch (error) {
        logger.error('Failed to export refresh configuration:', error)
        // Don't fail the request if export fails
      }

      return config.refreshIntervals
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
        speedMonitorUrl: z.string(),
        speedMqttUrl: z.string(),
        speedMqttTopic: z.string(),
        speedMqttUsername: z.string(),
        speedMqttClientId: z.string(),
        // The password itself is deliberately never returned: /admin and this
        // endpoint are unauthenticated, so a read must not disclose it. The
        // page reports only whether one is stored.
        speedMqttPasswordSet: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      logger.warn('TODO: config.set should be protected by authentication')

      const wasUploadEnabled = config.uploadLiveTiming
      const oldEventId = config.eventId
      const oldSpeedMonitorUrl = config.speedMonitorUrl
      const oldSpeedMqttUrl = config.speedMqttUrl
      const oldSpeedMqttTopic = config.speedMqttTopic
      const oldSpeedMqttUsername = config.speedMqttUsername
      const oldSpeedMqttPassword = config.speedMqttPassword
      const oldSpeedMqttClientId = config.speedMqttClientId
      const oldSpeedDatabasePath = config.speedDatabasePath

      config.set(input)
      config.storeConfig()

      // Reconnect the radar when either source has been pointed somewhere else
      if (
        config.speedMonitorUrl !== oldSpeedMonitorUrl ||
        config.speedMqttUrl !== oldSpeedMqttUrl ||
        config.speedMqttTopic !== oldSpeedMqttTopic ||
        config.speedMqttUsername !== oldSpeedMqttUsername ||
        config.speedMqttPassword !== oldSpeedMqttPassword ||
        config.speedMqttClientId !== oldSpeedMqttClientId
      ) {
        logger.info('Radar configuration changed, reconnecting the speed sources')
        restartSpeedSources()
      }

      if (config.speedDatabasePath !== oldSpeedDatabasePath) {
        logger.info(`Speed database path changed to ${config.speedDatabasePath}`)
        resetStore()
      }

      // Opened once and reused below for setNewEvent(), rather than constructing
      // a second set of clients that nothing would ever disconnect
      const newDatabases = input.eventId ? getEventDatabases(input.eventId) : null

      // Get the event name
      let eventName = ''
      let eventDate = ''
      try {
        // Check if eventId is defined before calling getEventDatabases
        if (newDatabases) {
          const { event } = newDatabases

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

      // Replacing the shared databases: disconnect the outgoing clients so a
      // long-running server does not accumulate them
      const disconnectPrevious = async () => {
        for (const client of [event, eventData, online]) {
          try {
            await client?.$disconnect()
          } catch (error) {
            logger.warn(`Failed to disconnect a previous event database: ${error}`)
          }
        }
      }

      if (newDatabases) {
        if (input.eventId !== oldEventId) {
          logger.info(
            `Event ID changed from ${oldEventId} to ${input.eventId}, recreating directory and triggering sync`,
          )
        }

        await disconnectPrevious()
        setNewEvent(newDatabases)
      }

      return {
        eventName,
        eventId: config.eventId,
        eventDate: eventDate,
        uploadLiveTiming: config.uploadLiveTiming,
        liveTimingOutputPath: config.liveTimingOutputPath,
        speedMonitorUrl: config.speedMonitorUrl,
        speedMqttUrl: config.speedMqttUrl,
        speedMqttTopic: config.speedMqttTopic,
        speedMqttUsername: config.speedMqttUsername,
        speedMqttClientId: config.speedMqttClientId,
        speedMqttPasswordSet: Boolean(config.speedMqttPassword),
      }
    }),
})
