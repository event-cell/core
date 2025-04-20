import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import dayjs from 'dayjs'
import { getCompetitorJSON } from '../router/shared.js'
import { getCurrentCompetitor } from '../router/currentCompetitor.js'
import { event } from '../router/shared.js'
import { getEventDatabases } from '../dbUtils.js'
import {
  getEventDirectories,
  getMetadataMap,
  safeWriteFile,
  getEventDate,
  writeMetadataFile,
  exportLiveTimingData,
} from './utils.js'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logger = setupLogger('scheduledTasks')
const execPromise = promisify(exec)

// Cache for metadata file timestamps
interface MetadataTimestampCache {
  [dateStr: string]: number // Unix timestamp in milliseconds
}

// Global cache to store metadata file timestamps
const metadataTimestampCache: MetadataTimestampCache = {}

/**
 * Gets the path to the live-timing directory
 */
function getLiveTimingDir(): string {
  return path.join(__dirname, '../../dist/live-timing')
}

/**
 * Gets the path to the events directory
 */
function getEventsDir(): string {
  return path.join(getLiveTimingDir(), 'events')
}

/**
 * Gets the path to the event metadata directory
 */
function getEventMetadataDir(): string {
  return path.join(getLiveTimingDir(), 'event-metadata')
}

/**
 * Gets the path to the site metadata directory
 */
function getSiteMetadataDir(): string {
  return path.join(getLiveTimingDir(), 'site-metadata')
}

/**
 * Gets the path to the site metadata file
 */
function getSiteMetadataFilePath(): string {
  return path.join(getSiteMetadataDir(), 'site-metadata.json')
}

/**
 * Gets the path to a specific JSON file
 */
function getJsonFilePath(filename: string): string {
  return path.join(getLiveTimingDir(), filename)
}

/**
 * Gets the path to the live-timing JSON directory
 */
function getLiveTimingJsonDir(): string {
  return path.join(getLiveTimingDir(), 'live-timing-json')
}

/**
 * Generates metadata for all events
 */
async function generateEventsMetadata() {
  try {
    // Get event directories and metadata
    const eventDirectories = await getEventDirectories()
    const metadataPath = getSiteMetadataFilePath()

    // Check if site-metadata.json exists on the website and get its last modified time
    let shouldRegenerate = true
    try {
      if (
        config.rsyncRemoteHost &&
        config.rsyncRemoteUser &&
        config.rsyncRemotePath
      ) {
        // Check the website's site-metadata.json file
        const checkMetadataCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "stat -c %Y ${config.rsyncRemotePath}/site-metadata.json"`
        const { stdout } = await execPromise(checkMetadataCommand)
        const metadataTimestamp = parseInt(stdout.trim(), 10) * 1000 // Convert to milliseconds
        const metadataDate = new Date(metadataTimestamp)

        // Get the latest event metadata modification date using SSH
        let latestEventDate = new Date(0)
        for (const dir of eventDirectories) {
          try {
            // Check if we have a cached timestamp for this directory
            const cachedTimestamp = metadataTimestampCache[dir]

            if (cachedTimestamp) {
              // Use cached timestamp
              const dirDate = new Date(cachedTimestamp)
              if (dirDate > latestEventDate) {
                latestEventDate = dirDate
              }
              logger.debug(
                `Using cached timestamp for ${dir}: ${dirDate.toISOString()}`,
              )
            } else {
              // Check the metadata.json file within each event directory
              const sshCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "stat -c %Y ${config.rsyncRemotePath}/${dir}/metadata.json"`
              const { stdout } = await execPromise(sshCommand)
              const timestamp = parseInt(stdout.trim(), 10) * 1000 // Convert to milliseconds

              // Cache the timestamp
              metadataTimestampCache[dir] = timestamp

              const dirDate = new Date(timestamp)
              if (dirDate > latestEventDate) {
                latestEventDate = dirDate
              }
              logger.debug(
                `Fetched and cached timestamp for ${dir}: ${dirDate.toISOString()}`,
              )
            }
          } catch (error) {
            // If metadata.json doesn't exist in the directory, skip it
            logger.warn(
              `No metadata.json found in directory ${dir}, skipping timestamp check`,
            )
          }
        }

        // Only regenerate if the latest event metadata is newer than the site-metadata.json file
        shouldRegenerate = latestEventDate > metadataDate
        logger.info(
          `Latest event metadata modified: ${latestEventDate.toISOString()}, site metadata date: ${metadataDate.toISOString()}`,
        )
      }
    } catch (error) {
      // If site-metadata.json doesn't exist on the website, we should regenerate
      logger.info(
        'No existing site-metadata.json found on website, will generate new metadata',
      )
    }

    if (!shouldRegenerate) {
      logger.info('Metadata is up to date, skipping regeneration')
      return
    }

    logger.info('Generating new metadata...')
    const metadataMap = await getMetadataMap(eventDirectories)

    logger.info('Live timing paths:')
    logger.info(`- Metadata path: ${metadataPath}`)

    // Create the site metadata directory if it doesn't exist
    await fs.mkdir(path.dirname(metadataPath), { recursive: true })

    // Write the site metadata file locally
    await fs.writeFile(
      metadataPath,
      JSON.stringify({
        eventDirectories,
        metadataMap,
      }),
    )
    logger.info('Successfully generated new metadata')

    // Upload the site metadata to the website
    if (
      config.rsyncRemoteHost &&
      config.rsyncRemoteUser &&
      config.rsyncRemotePath
    ) {
      const remotePath = join(config.rsyncRemotePath, 'site-metadata.json')
      const rsyncCommand = `rsync -avz --delete -e "ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no" ${metadataPath} ${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${remotePath}`

      try {
        const { stdout, stderr } = await execPromise(rsyncCommand)
        if (stderr) {
          logger.warn(`Rsync warnings for site metadata upload: ${stderr}`)
        }
        logger.info(`Successfully uploaded site metadata to ${remotePath}`)
      } catch (error) {
        logger.error('Failed to upload site metadata:', error)
      }
    }
  } catch (error) {
    logger.error('Error generating events metadata:', error)
  }
}

/**
 * Syncs live timing data to the remote server
 */
async function syncLiveTimingData() {
  if (!config.uploadLiveTiming) {
    logger.info('Live timing upload is not enabled, skipping sync')
    return
  }

  try {
    // Get event date in YYYY-MM-DD format
    const eventDate = await getEventDate()
    const dateStr = eventDate.format('YYYY-MM-DD')

    // Export live timing data
    await exportLiveTimingData()

    // Write metadata to event directory
    try {
      const websiteDirectory = dateStr
      await writeMetadataFile(websiteDirectory, config.eventId)
      logger.info('Successfully wrote metadata file to event directory')
    } catch (error) {
      logger.error('Error writing metadata file:', error)
    }

    // Sync to remote server
    if (
      config.rsyncRemoteHost &&
      config.rsyncRemoteUser &&
      config.rsyncRemotePath
    ) {
      // Define the remote paths
      const eventRemotePath = join(
        config.rsyncRemotePath,
        dateStr,
        'api',
        'simple',
      )
      const liveTimingRemotePath = join(
        config.rsyncRemotePath,
        'live-timing',
        'api',
        'simple',
      )

      // Create remote directories if they don't exist
      const mkdirCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "mkdir -p ${eventRemotePath} ${liveTimingRemotePath}"`
      try {
        await execPromise(mkdirCommand)
        logger.info('Created remote directories if they did not exist')
      } catch (error) {
        logger.error('Failed to create remote directories:', error)
        return // Don't proceed with rsync if we can't create directories
      }

      // Sync each file to event date directory
      // Sync all files to both event date and live-timing directories
      const localPath = getLiveTimingJsonDir()
      const paths = [
        { source: localPath, dest: eventRemotePath },
        { source: localPath, dest: liveTimingRemotePath },
      ]

      for (const { source, dest } of paths) {
        const rsyncCommand = `rsync -avz --delete -e "ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no" ${source}/* ${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${dest}/`

        logger.info(`Executing rsync command: ${rsyncCommand}`)
        const { stdout, stderr } = await execPromise(rsyncCommand)

        if (stderr) {
          logger.warn(`Rsync warnings: ${stderr}`)
        }
        logger.info(`Successfully synced files to ${dest}`)

        // Check and sync UI files to display directory
        const uiSourcePath = path.join(__dirname, '../../dist/server/ui/')
        if (existsSync(uiSourcePath)) {
          // Construct the display path at the same level as the api directory
          const displayRemotePath = join(
            path.dirname(path.dirname(dest)),
            'display',
          )

          // First ensure the parent directory exists
          const parentDir = path.dirname(displayRemotePath)
          const mkdirParentCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "mkdir -p ${parentDir}"`

          try {
            await execPromise(mkdirParentCommand)
            logger.info(`Created parent directory at ${parentDir}`)

            // Now create the display directory
            const mkdirDisplayCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "mkdir -p ${displayRemotePath}"`
            await execPromise(mkdirDisplayCommand)
            logger.info(`Created display directory at ${displayRemotePath}`)

            // Sync UI files to display directory
            const uiRsyncCommand = `rsync -avz --delete -e "ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no" ${uiSourcePath}/* ${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${displayRemotePath}/`

            const { stderr } = await execPromise(uiRsyncCommand)
            if (stderr) {
              logger.warn(`UI rsync warnings: ${stderr}`)
            }
            logger.info(`Successfully synced UI files to ${displayRemotePath}`)
          } catch (error) {
            logger.error('Failed to create/sync display directory:', error)
            logger.error(`Parent dir: ${parentDir}`)
            logger.error(`Display dir: ${displayRemotePath}`)
          }
        } else {
          logger.warn('UI files not found in dist/server/ui/, skipping UI sync')
        }
      }

      logger.info(`Successfully synced live timing data to remote server`)
    } else {
      logger.warn(
        'Rsync configuration is incomplete. Cannot sync to remote server.',
      )
    }
  } catch (error) {
    logger.error('Error syncing live timing data:', error)
  }
}

/**
 * Executes all scheduled tasks
 */
async function executeScheduledTasks() {
  try {
    // Only sync live timing data if upload is enabled
    if (config.uploadLiveTiming) {
      // Sync live timing data
      await syncLiveTimingData()

      // Wait for file system changes to propagate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate events metadata
      await generateEventsMetadata()
    }
  } catch (error) {
    logger.error('Error executing scheduled tasks:', error)
  }
}

// Export the main functions
export { executeScheduledTasks, syncLiveTimingData, generateEventsMetadata }
