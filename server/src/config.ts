import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

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
    this.updateConfig(config)
  }

  /**
   * Sets all of the local config variables to the contents of the file
   * @param config The new config
   */
  protected updateConfig(config: any) {
    if (config.eventId) this.eventId = config.eventId
    if (config.eventName) this.eventName = config.eventName

    if (config.eventDatabasePath)
      this.eventDatabasePath = config.eventDatabasePath
  }

  /**
   * Stores local config changes to disk
   */
  public storeConfig() {
    const config = {
      eventId: this.eventId,
      eventName: this.eventName,
      eventDatabasePath: this.eventDatabasePath,
    }

    const fileContents = JSON.stringify(config, null, 2)
    writeFileSync(this.configPath, fileContents)
  }
}

export const config = new Config()
