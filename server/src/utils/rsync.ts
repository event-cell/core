import { config } from '../config.js'
import { setupLogger } from './index.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import { dirname } from 'path'

const execAsync = promisify(exec)
const logger = setupLogger('rsync')

export interface RsyncOptions {
  source: string
  destination?: string
  exclude?: string[]
  include?: string[]
  delete?: boolean
  isFile?: boolean
}

export class RsyncService {
  /**
   * Syncs files from a source directory to a remote destination using rsync
   * @param options The rsync options
   * @returns A promise that resolves when the sync is complete
   */
  public async sync(options: RsyncOptions): Promise<void> {
    try {
      // Build the rsync command
      const destination = options.destination || config.rsyncRemotePath
      const remotePath = `${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${destination}`

      // For directories or files with a parent directory, create parent directories
      if (!options.isFile || dirname(destination) !== '.') {
        const parentDir = options.isFile ? dirname(destination) : destination
        const mkdirCommand = `ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "mkdir -p ${parentDir}"`
        logger.info(`Creating parent directories: ${mkdirCommand}`)
        await execAsync(mkdirCommand)
      }

      // Start with the basic command
      let command = `rsync -avz`

      // Add delete flag if specified
      if (options.delete) {
        command += ' --delete'
      }

      // Add exclude patterns if provided
      if (options.exclude && options.exclude.length > 0) {
        options.exclude.forEach((pattern) => {
          command += ` --exclude="${pattern}"`
        })
      }

      // Add include patterns if provided
      if (options.include && options.include.length > 0) {
        options.include.forEach((pattern) => {
          command += ` --include="${pattern}"`
        })
      }

      // Add SSH options
      command += ` -e "ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no"`

      // Add source and destination
      if (options.isFile) {
        // For files, don't add a trailing slash to the source
        command += ` ${options.source} ${remotePath}`
      } else {
        // For directories, add a trailing slash to the source
        command += ` ${options.source}/ ${remotePath}/`
      }

      logger.info(`Executing rsync command: ${command}`)

      // Execute the command
      const { stdout, stderr } = await execAsync(command)

      if (stderr) {
        logger.warn('Rsync warnings:', stderr)
      }

      logger.info('Rsync completed successfully')
      logger.debug('Rsync output:', stdout)
    } catch (error) {
      logger.error('Failed to execute rsync:', error)
      throw error
    }
  }
}

export const rsyncService = new RsyncService()
