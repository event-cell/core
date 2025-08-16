/// <reference types="@total-typescript/ts-reset" />

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

import { setupLogger } from './utils/index.js'

const logger = setupLogger('config')

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const ConfigType = z
  .object({
    eventId: z.string(),
    eventName: z.string(),
    eventDatabasePath: z.string(),
    recordsDatabasePath: z.string(),
    uploadLiveTiming: z.boolean().optional(),
    liveTimingOutputPath: z.string().optional(),
    rsyncRemoteHost: z.string().optional(),
    rsyncRemoteUser: z.string().optional(),
    rsyncRemotePath: z.string().optional(),
    rsyncSshKeyPath: z.string().optional(),
    // Display distribution configuration
    displayDistribution: z.object({
      maxRowsPerDisplay: z.number().min(1).optional(),
    }).optional(),
    // Refresh intervals configuration
    refreshIntervals: z.object({
      display1: z.number().min(1).max(300).optional(),
      display2: z.number().min(1).max(300).optional(),
      display3: z.number().min(1).max(300).optional(),
      display4: z.number().min(1).max(300).optional(),
      trackDisplay: z.number().min(1).max(300).optional(),
      announcer: z.number().min(1).max(300).optional(),
      fallbackInterval: z.number().min(60).max(1800).optional(),
    }).optional(),
  })
  .deepPartial()
export type ConfigType = z.infer<typeof ConfigType>

/**
 * Config singleton
 */
class Config {
  public eventId = '001'
  public eventName = 'Unnamed Event'
  public eventDatabasePath = join(__dirname, '..', 'prisma/Events')
  public recordsDatabasePath = '/data/records'
  public resultsPath = '/data/results'
  public uploadLiveTiming = false
  public liveTimingOutputPath = '/data/live-timing'
  public rsyncRemoteHost = ''
  public rsyncRemoteUser = ''
  public rsyncRemotePath = ''
  public rsyncSshKeyPath = '/data/.ssh/id_rsa'

  // Display distribution configuration defaults
  public displayDistribution = {
    maxRowsPerDisplay: 20,
  }

  // Refresh intervals configuration defaults
  public refreshIntervals = {
    display1: 15,
    display2: 15,
    display3: 15,
    display4: 5,
    trackDisplay: 2,
    announcer: 2,
    fallbackInterval: 300, // 5 minutes
  }

  constructor() {
    const fileContents = readFileSync(this.configPath, 'utf8')
    const parsedContents = JSON.parse(fileContents)
    const config = ConfigType.parse(parsedContents)
    this.set(config)

    // Auto-save default refresh intervals if they don't exist
    if (!config.refreshIntervals) {
      logger.info('Refresh intervals not found in config, saving defaults')
      this.storeConfig()
    } else {
      // Check if any individual refresh interval properties are missing and save defaults
      const hasAllProperties = config.refreshIntervals &&
        typeof config.refreshIntervals.display1 === 'number' &&
        typeof config.refreshIntervals.display2 === 'number' &&
        typeof config.refreshIntervals.display3 === 'number' &&
        typeof config.refreshIntervals.display4 === 'number' &&
        typeof config.refreshIntervals.trackDisplay === 'number' &&
        typeof config.refreshIntervals.announcer === 'number' &&
        typeof config.refreshIntervals.fallbackInterval === 'number'

      if (!hasAllProperties) {
        logger.info('Some refresh interval properties missing, saving defaults')
        this.storeConfig()
      }
    }

    // Force uploadLiveTiming to false on startup
    if (this.uploadLiveTiming) {
      logger.info('Forcing uploadLiveTiming to false on startup')
      this.uploadLiveTiming = false
      this.storeConfig()
    }
  }

  private get configPath() {
    if (process.env.CONFIG_DIR) {
      const configDir = process.env.CONFIG_DIR
      const configFile = join(configDir, 'config.json')

      // Create config file if it doesn't exist
      if (!existsSync(configFile)) {
        logger.info(`Creating config file in ${configDir}`)
        writeFileSync(configFile, '{}')
      }

      return configFile
    }

    // /data/ should be the default location for the persistent volume for this
    // app, if it exists. If the folder exists, but there is no config file, we
    // should create the config file in the folder
    if (existsSync('/data/')) {
      if (!existsSync('/data/config.json')) {
        logger.info(
          'Creating config file in `/data/`. If this is not where you want it, specify the CONFIG_DIR env variable',
        )
        writeFileSync('/data/config.json', '{}')
      }

      return '/data/config.json'
    }

    return join(__dirname, '..', 'config.json')
  }

  /**
   * Sets all the local config variables to the contents of the file
   * @param config The new config
   */
  public set(config: ConfigType) {
    if (config.eventId) this.eventId = config.eventId
    if (config.eventName) this.eventName = config.eventName
    if (config.eventDatabasePath)
      this.eventDatabasePath = config.eventDatabasePath
    if (config.recordsDatabasePath)
      this.recordsDatabasePath = config.recordsDatabasePath
    if (typeof config.uploadLiveTiming === 'boolean') {
      if (this.uploadLiveTiming !== config.uploadLiveTiming) {
        logger.info(`uploadLiveTiming changed to ${config.uploadLiveTiming}`)
      }
      this.uploadLiveTiming = config.uploadLiveTiming
    }
    if (typeof config.liveTimingOutputPath === 'string') {
      logger.info(`liveTimingOutputPath set to ${config.liveTimingOutputPath}`)
      this.liveTimingOutputPath = config.liveTimingOutputPath
    }
    if (config.rsyncRemoteHost) this.rsyncRemoteHost = config.rsyncRemoteHost
    if (config.rsyncRemoteUser) this.rsyncRemoteUser = config.rsyncRemoteUser
    if (config.rsyncRemotePath) this.rsyncRemotePath = config.rsyncRemotePath
    if (config.rsyncSshKeyPath) this.rsyncSshKeyPath = config.rsyncSshKeyPath

    // Set display distribution configuration
    if (config.displayDistribution) {
      if (typeof config.displayDistribution.maxRowsPerDisplay === 'number') {
        this.displayDistribution.maxRowsPerDisplay = config.displayDistribution.maxRowsPerDisplay
        logger.info(`Display distribution max rows per display set to ${config.displayDistribution.maxRowsPerDisplay}`)
      }
    }

    // Set refresh intervals configuration
    if (config.refreshIntervals) {
      const intervals = config.refreshIntervals
      if (typeof intervals.display1 === 'number') {
        this.refreshIntervals.display1 = intervals.display1
        logger.info(`Display 1 refresh interval set to ${intervals.display1} seconds`)
      }
      if (typeof intervals.display2 === 'number') {
        this.refreshIntervals.display2 = intervals.display2
        logger.info(`Display 2 refresh interval set to ${intervals.display2} seconds`)
      }
      if (typeof intervals.display3 === 'number') {
        this.refreshIntervals.display3 = intervals.display3
        logger.info(`Display 3 refresh interval set to ${intervals.display3} seconds`)
      }
      if (typeof intervals.display4 === 'number') {
        this.refreshIntervals.display4 = intervals.display4
        logger.info(`Display 4 refresh interval set to ${intervals.display4} seconds`)
      }
      if (typeof intervals.trackDisplay === 'number') {
        this.refreshIntervals.trackDisplay = intervals.trackDisplay
        logger.info(`TrackDisplay refresh interval set to ${intervals.trackDisplay} seconds`)
      }
      if (typeof intervals.announcer === 'number') {
        this.refreshIntervals.announcer = intervals.announcer
        logger.info(`Announcer refresh interval set to ${intervals.announcer} seconds`)
      }
      if (typeof intervals.fallbackInterval === 'number') {
        this.refreshIntervals.fallbackInterval = intervals.fallbackInterval
        logger.info(`Fallback refresh interval set to ${intervals.fallbackInterval} seconds`)
      }
    }
  }

  public asJSON() {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      eventDatabasePath: this.eventDatabasePath,
      recordsDatabasePath: this.recordsDatabasePath,
      uploadLiveTiming: this.uploadLiveTiming,
      liveTimingOutputPath: this.liveTimingOutputPath,
      rsyncRemoteHost: this.rsyncRemoteHost,
      rsyncRemoteUser: this.rsyncRemoteUser,
      rsyncRemotePath: this.rsyncRemotePath,
      rsyncSshKeyPath: this.rsyncSshKeyPath,
      displayDistribution: this.displayDistribution,
      refreshIntervals: this.refreshIntervals,
    }
  }

  /**
   * Stores local config changes to disk
   */
  public storeConfig() {
    const fileContents = JSON.stringify(this.asJSON(), null, 2)
    writeFileSync(this.configPath, fileContents)
  }
}

export const config = new Config()
