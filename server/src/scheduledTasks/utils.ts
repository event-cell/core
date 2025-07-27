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
import { executeScheduledTasks, syncLiveTimingData } from './index.js'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logger = setupLogger('scheduledTasks/utils')
const execPromise = promisify(exec)

// Add metadata loading lock
let isMetadataLoading = false
let metadataLoadingPromise: Promise<Record<string, any>> | null = null

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
 * Gets the path to the live-timing JSON directory
 */
function getLiveTimingJsonDir(): string {
  return path.join(getLiveTimingDir(), 'live-timing-json')
}

/**
 * Gets the path to a specific JSON file in the events directory
 */
function getJsonFilePath(filename: string): string {
  return path.join(getEventsDir(), filename)
}

/**
 * Gets the path to a specific JSON file in the live-timing JSON directory
 */
function getLiveTimingJsonFilePath(filename: string): string {
  return path.join(getLiveTimingJsonDir(), filename)
}

/**
 * Gets the path to the metadata file for a specific event
 */
function getEventMetadataFilePath(dateStr: string): string {
  return path.join(getEventMetadataDir(), `${dateStr}.json`)
}

/**
 * Gets the path to the site metadata file
 */
function getSiteMetadataFilePath(): string {
  return path.join(getSiteMetadataDir(), 'site-metadata.json')
}

/**
 * Gets event directories from the remote server
 */
async function getEventDirectories(): Promise<string[]> {
  try {
    // Check if we have the necessary rsync configuration
    if (
      !config.rsyncRemoteHost ||
      !config.rsyncRemoteUser ||
      !config.rsyncRemotePath
    ) {
      logger.warn(
        'Rsync configuration is incomplete. Cannot list directories from remote server.',
      )
      return []
    }

    // Use SSH to list directories on the remote server
    const sshCommand = `ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "ls -la ${config.rsyncRemotePath}/ | grep '^d' | grep -E '^d.*[0-9]{4}-[0-9]{2}-[0-9]{2}$' | awk '{print \\$9}'"`

    logger.info(`Executing SSH command to list directories: ${sshCommand}`)
    const { stdout, stderr } = await execPromise(sshCommand)

    if (stderr) {
      logger.warn(`SSH command warnings: ${stderr}`)
    }

    // Parse the directory list
    const directories = stdout
      .trim()
      .split('\n')
      .filter((dir) => dir && /^\d{4}-\d{2}-\d{2}$/.test(dir))
      .sort()
      .reverse() // Most recent first

    logger.info(
      `Found ${directories.length} event directories on remote server`,
    )
    return directories
  } catch (error) {
    logger.error('Failed to get event directories from remote server:', error)
    return []
  }
}

/**
 * Gets metadata for a list of event directories
 */
async function getMetadataMap(
  directories: string[],
): Promise<Record<string, any>> {
  // If metadata is already being loaded, wait for that to complete
  if (isMetadataLoading && metadataLoadingPromise) {
    logger.info('Metadata already being loaded, waiting for completion...')
    return metadataLoadingPromise
  }

  // Set loading flag and create new promise
  logger.info(`Starting metadata fetch for ${directories.length} directories`)
  isMetadataLoading = true
  metadataLoadingPromise = (async () => {
    const metadataMap: Record<string, any> = {}
    const startTime = Date.now()

    for (const dateStr of directories) {
      try {
        logger.info(
          `Fetching metadata for ${dateStr} (${directories.indexOf(dateStr) + 1}/${directories.length})`,
        )
        const fetchStartTime = Date.now()

        const sshCommand = `ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "cat ${config.rsyncRemotePath}/${dateStr}/metadata.json"`
        const { stdout } = await execPromise(sshCommand)
        metadataMap[dateStr] = JSON.parse(stdout)

        const fetchDuration = Date.now() - fetchStartTime
        logger.info(
          `✅ Successfully fetched metadata for ${dateStr} in ${fetchDuration}ms`,
        )
      } catch (error) {
        logger.error(`❌ Failed to fetch metadata for ${dateStr}:`, error)
        metadataMap[dateStr] = null
      }
    }

    const totalDuration = Date.now() - startTime
    logger.info(
      `Completed metadata fetch for ${directories.length} directories in ${totalDuration}ms`,
    )
    return metadataMap
  })()

  try {
    return await metadataLoadingPromise
  } finally {
    // Reset loading state
    isMetadataLoading = false
    metadataLoadingPromise = null
    logger.info('Metadata loading lock released')
  }
}

/**
 * Safely writes a file, creating parent directories if needed
 */
async function safeWriteFile(filePath: string, data: any, label: string) {
  try {
    // Ensure the parent directory exists
    const parentDir = dirname(filePath)
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true })
      logger.info(`Created directory: ${parentDir}`)
    }

    // For currentCompetitor.json, ensure it's written as a number
    if (label === 'currentCompetitor.json') {
      writeFileSync(filePath, JSON.stringify(Number(data), null, 2))
    } else {
      writeFileSync(filePath, JSON.stringify(data, null, 2))
    }
    logger.info(`✅ Wrote ${label} to ${filePath}`)
  } catch (error: any) {
    logger.error(`❌ Failed to write ${label}: ${error.message}`)
  }
}

/**
 * Gets the event date from the database
 */
async function getEventDate() {
  try {
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

      logger.info(
        `Found event date in database: ${dayjs(jsDate).format('YYYY-MM-DD')}`,
      )
      return dayjs(jsDate)
    } else {
      logger.warn('No event date found in database, using current date')
      return dayjs()
    }
  } catch (error) {
    logger.error('Error getting event date from database:', error)
    return dayjs()
  }
}

/**
 * Writes a metadata.json file with event information
 */
async function writeMetadataFile(destinationPath: string, eventId: string) {
  // Check if metadata already exists on web server
  if (
    config.rsyncRemoteHost &&
    config.rsyncRemoteUser &&
    config.rsyncRemotePath
  ) {
    try {
      const remotePath = join(
        config.rsyncRemotePath,
        destinationPath,
        'metadata.json',
      )
      const checkCommand = `ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "test -f ${remotePath} && echo exists"`

      const { stdout } = await execPromise(checkCommand)
      if (stdout.trim() === 'exists') {
        logger.info(
          'Event metadata file already exists on web server, skipping generation',
        )
        return
      }
    } catch (error) {
      // File doesn't exist or error checking, proceed with generation
      logger.info(
        'No existing metadata file found on web server, will generate new one',
      )
    }
  }

  try {
    const eventMetadataFilePath = join(getEventMetadataDir(), 'metadata.json')
    let eventName = 'Event'

    // Get the event name from the database
    try {
      const { event } = getEventDatabases(eventId)
      const title2Param = await event.tPARAMETERS.findFirst({
        where: { C_PARAM: 'TITLE2' },
      })
      if (title2Param?.C_VALUE) {
        eventName = title2Param.C_VALUE
      }
    } catch (error) {
      logger.error('Failed to get event name from database:', error)
    }

    const metadata = {
      eventId,
      eventName,
      lastUpdated: new Date().toISOString(),
    }

    // Cache metadata locally
    await safeWriteFile(eventMetadataFilePath, metadata, 'metadata.json')
    logger.info(`Cached metadata file to ${eventMetadataFilePath}`)

    // Upload to website using rsync
    if (
      config.rsyncRemoteHost &&
      config.rsyncRemoteUser &&
      config.rsyncRemotePath
    ) {
      const remotePath = join(
        config.rsyncRemotePath,
        destinationPath,
        'metadata.json',
      )
      const rsyncCommand = `rsync -avz --delete -e "ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no" ${eventMetadataFilePath} ${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${remotePath}`

      try {
        // Create remote directory if it doesn't exist
        const remoteDir = dirname(remotePath)
        const mkdirCommand = `ssh -i /app/.ssh/id_rsa -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "mkdir -p ${remoteDir}"`
        await execPromise(mkdirCommand)
        logger.info(`Created remote directory ${remoteDir} if it did not exist`)
        const { stdout, stderr } = await execPromise(rsyncCommand)
        if (stderr) {
          logger.warn(`Rsync warnings for metadata upload: ${stderr}`)
        }
        logger.info(`Successfully uploaded metadata to ${remotePath}`)
      } catch (error) {
        logger.error('Failed to upload metadata file:', error)
      }
    }
  } catch (error) {
    logger.error('Failed to write metadata file:', error)
  }
}

/**
 * Exports live timing data to the API directory
 */
async function exportLiveTimingData() {
  try {
    // Get the event date from the database
    const eventDate = await getEventDate()
    const dateStr = eventDate.format('YYYY-MM-DD')

    // Ensure the live-timing JSON directory exists
    const liveTimingJsonDir = getLiveTimingJsonDir()
    if (!existsSync(liveTimingJsonDir)) {
      mkdirSync(liveTimingJsonDir, { recursive: true })
    }

    // Export competitor data
    const competitors = await getCompetitorJSON()
    await safeWriteFile(
      getLiveTimingJsonFilePath('competitors.json'),
      competitors,
      'competitors.json',
    )

    // Export current competitor data
    const currentCompetitor = await getCurrentCompetitor()
    await safeWriteFile(
      getLiveTimingJsonFilePath('currentCompetitor.json'),
      currentCompetitor,
      'currentCompetitor.json',
    )

    // Calculate the maximum number of runs for any competitor
    const maxRuns = Math.max(
      1,
      competitors.reduce((max, competitor) => {
        const competitorRuns = competitor.times.length
        return competitorRuns > max ? competitorRuns : max
      }, 0),
    )

    // Export maxRuns to runs.json
    await safeWriteFile(
      getLiveTimingJsonFilePath('runs.json'),
      maxRuns,
      'runs.json',
    )

    // Export event date to date.json
    await safeWriteFile(
      getLiveTimingJsonFilePath('date.json'),
      dateStr,
      'date.json',
    )

    logger.info(`Exported live timing data to ${liveTimingJsonDir}`)
  } catch (error) {
    logger.error('Failed to export live timing data:', error)
  }
}

async function updateLiveTimingDirect() {
  try {
    // Get event directories and metadata
    const eventDirectories = await getEventDirectories()
    const metadataMap = await getMetadataMap(eventDirectories)

    // Create metadata file with metadata
    const metadataPath = getSiteMetadataFilePath()

    logger.info('Live timing paths:')
    logger.info(`- Metadata path: ${metadataPath}`)

    await fs.mkdir(path.dirname(metadataPath), { recursive: true })
    await fs.writeFile(
      metadataPath,
      JSON.stringify({
        eventDirectories,
        metadataMap,
      }),
    )
  } catch (error) {
    logger.error('Error updating live timing:', error)
  }
}

// Export the scheduledTasks object with both local and imported functions
export const scheduledTasks = {
  updateLiveTimingDirect,
  executeScheduledTasks,
  syncLiveTimingData,
  getEventDirectories,
  getMetadataMap,
  safeWriteFile,
  getEventDate,
  writeMetadataFile,
  exportLiveTimingData,
}

// Re-export the main functions for direct import
export {
  executeScheduledTasks,
  syncLiveTimingData,
  getEventDirectories,
  getMetadataMap,
  safeWriteFile,
  getEventDate,
  writeMetadataFile,
  exportLiveTimingData,
}
