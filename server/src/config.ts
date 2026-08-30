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
    speedDatabasePath: z.string(),
    speedMonitorUrl: z.string(),
    speedMqttUrl: z.string(),
    speedMqttTopic: z.string(),
    speedMqttUsername: z.string(),
    speedMqttPassword: z.string(),
    speedMqttClientId: z.string(),
    uploadLiveTiming: z.boolean().optional(),
    liveTimingOutputPath: z.string().optional(),
    rsyncRemoteHost: z.string().optional(),
    rsyncRemoteUser: z.string().optional(),
    rsyncRemotePath: z.string().optional(),
    rsyncSshKeyPath: z.string().optional(),
    // Display distribution configuration
    displayDistribution: z.object({
      maxRowsPerDisplay: z.number().min(1).optional(),
      classOrder: z.array(z.number()).optional(),
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
  /**
   * Where the timing software's .scdb files are mounted. An absolute container
   * path, matching docker-compose.yml and config.json.example, so the config
   * written for a fresh container is correct as it stands.
   *
   * It was derived from __dirname, which points at the build layout
   * (/app/server/dist/prisma/Events) rather than the mount, so every new
   * container started with an event path that does not exist. Native runs
   * supply their own path through CONFIG_DIR — see docs/development.md.
   */
  public eventDatabasePath = '/app/prisma/Events'
  public recordsDatabasePath = '/data/records'
  /**
   * Speeds.db, which sits beside the event databases. The directory is mounted
   * read-write for this reason — see docker-compose.yml.
   */
  public speedDatabasePath = '/app/prisma/Events/Speeds.db'
  public resultsPath = '/data/results'
  /**
   * The radar speed monitor page. Its host is used to derive the WebSocket the
   * radar publishes speeds on — see `getRadarSocketUrl()` in `radar/client.ts`.
   */
  public speedMonitorUrl = 'http://radar1.local/radar/two.html'
  /**
   * The radar's MQTT broker, which is the preferred source: it publishes a
   * message per completed pass, each carrying its own timestamp, so readings
   * survive a patchy network. The monitor URL above is the fallback for when
   * the broker cannot be reached.
   *
   * Credentials are deliberately blank by default — they belong in config.json,
   * not in the repository.
   */
  public speedMqttUrl = 'wss://www.dd.id.au:443/mqtt'
  public speedMqttTopic = 'radar/#'
  public speedMqttUsername = ''
  public speedMqttPassword = ''
  /** Never `Radar_Sink`: a broker evicts an existing session with the same id */
  public speedMqttClientId = 'event-cell-core'
  public uploadLiveTiming = false
  public liveTimingOutputPath = '/data/live-timing'
  public rsyncRemoteHost = ''
  public rsyncRemoteUser = ''
  public rsyncRemotePath = ''
  public rsyncSshKeyPath = '/data/.ssh/id_rsa'

  // Display distribution configuration defaults
  public displayDistribution: { maxRowsPerDisplay: number; classOrder: number[] } = {
    maxRowsPerDisplay: 25,
    /** Class indexes in the admin's preferred order; empty means automatic */
    classOrder: [],
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
    if (config.speedDatabasePath)
      this.speedDatabasePath = config.speedDatabasePath
    if (config.speedMonitorUrl) {
      if (this.speedMonitorUrl !== config.speedMonitorUrl) {
        logger.info(`speedMonitorUrl set to ${config.speedMonitorUrl}`)
      }
      this.speedMonitorUrl = config.speedMonitorUrl
    }
    if (config.speedMqttUrl) {
      if (this.speedMqttUrl !== config.speedMqttUrl) {
        logger.info(`speedMqttUrl set to ${config.speedMqttUrl}`)
      }
      this.speedMqttUrl = config.speedMqttUrl
    }
    if (config.speedMqttTopic) this.speedMqttTopic = config.speedMqttTopic
    if (config.speedMqttUsername) this.speedMqttUsername = config.speedMqttUsername
    if (config.speedMqttPassword) this.speedMqttPassword = config.speedMqttPassword
    if (config.speedMqttClientId) this.speedMqttClientId = config.speedMqttClientId
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
      if (Array.isArray(config.displayDistribution.classOrder)) {
        this.displayDistribution.classOrder = config.displayDistribution.classOrder.filter(
          (classIndex): classIndex is number => typeof classIndex === 'number',
        )
        logger.info(`Class order set: ${this.displayDistribution.classOrder.join(', ') || '(automatic)'}`)
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
      speedDatabasePath: this.speedDatabasePath,
      speedMonitorUrl: this.speedMonitorUrl,
      speedMqttUrl: this.speedMqttUrl,
      speedMqttTopic: this.speedMqttTopic,
      speedMqttUsername: this.speedMqttUsername,
      speedMqttPassword: this.speedMqttPassword,
      speedMqttClientId: this.speedMqttClientId,
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
