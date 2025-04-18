/// <reference types="@total-typescript/ts-reset" />

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'

import { setupLogger } from './utils'

const logger = setupLogger('config')

export const ConfigType = z
  .object({
    eventId: z.string(),
    eventName: z.string(),
    eventDatabasePath: z.string(),
    recordsDatabasePath: z.string(),
    uploadLiveTiming: z.boolean().optional(),
    liveTimingOutputPath: z.string().optional(),
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


  constructor() {
    const fileContents = readFileSync(this.configPath, 'utf8')
    const parsedContents = JSON.parse(fileContents)
    const config = ConfigType.parse(parsedContents)
    this.set(config)
  }

  private get configPath() {
    if (process.env.CONFIG_DIR) return process.env.CONFIG_DIR

    // /data/ should be the default location for the persistent volume for this
    // app, if it exists. If the folder exists, but there is no config file, we
    // should create the config file in the folder
    if (existsSync('/data/')) {
      if (!existsSync('/data/config.json')) {
        logger.info(
          'Creating config file in `/data/`. If this is not where you want it, specify the CONFIG_DIR env variable'
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
  }

  public asJSON() {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      eventDatabasePath: this.eventDatabasePath,
      uploadLiveTiming: this.uploadLiveTiming,
      liveTimingOutputPath: this.liveTimingOutputPath,
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
