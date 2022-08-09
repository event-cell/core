import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'

export const ConfigType = z.object({
  eventId: z.optional(z.string()),
  eventName: z.optional(z.string()),

  eventDatabasePath: z.optional(z.string()),
})
export type ConfigType = z.infer<typeof ConfigType>

/**
 * Config singleton
 */
class Config {
  private configPath = process.env.CONFIG_DIR || './config.json'

  public eventId = '001'
  public eventName = 'Unnamed Event'

  public eventDatabasePath = join(__dirname, '..', 'prisma/Events')

  constructor() {
    const fileContents = readFileSync(this.configPath, 'utf8')
    const config = JSON.parse(fileContents)
    this.set(config)
  }

  /**
   * Sets all of the local config variables to the contents of the file
   * @param config The new config
   */
  public set(config: ConfigType) {
    if (config.eventId) this.eventId = config.eventId
    if (config.eventName) this.eventName = config.eventName

    if (config.eventDatabasePath)
      this.eventDatabasePath = config.eventDatabasePath
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
