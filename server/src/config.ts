import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { setupLogger } from './utils'
import { z } from 'zod'

const logger = setupLogger('config')

export const ConfigType = z.object({
  eventId: z.optional(z.string()),
  eventName: z.optional(z.string()),

  eventDatabasePath: z.optional(z.string()),
  recordsDatabasePath: z.optional(z.string()),
})
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

  constructor() {
    const fileContents = readFileSync(this.configPath, 'utf8')
    const config = JSON.parse(fileContents)
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
  }

  public asJSON() {
    return {
      eventId: this.eventId,
      eventName: this.eventName,

      eventDatabasePath: this.eventDatabasePath,
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
