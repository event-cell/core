import { setupLogger, rsyncService } from '../utils'

const logger = setupLogger('scheduledTasks/scheduledTasks')
import { config } from '../config'
import { mkdirSync, writeFileSync, existsSync, cpSync, rmSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import dayjs from 'dayjs'
import { getCompetitorJSON } from '../router/shared'
import { getCurrentCompetitor } from '../router/currentCompetitor'
import { getCurrentHeat } from '../utils'
import { exec } from 'child_process'
import { promisify } from 'util'
import { event } from '../router/shared'
import { getEventDatabases } from '../dbUtils'
import { buildLiveTimingIndex } from './liveTimingBuilder'

const execAsync = promisify(exec)

let terminateRequested = false
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received — will exit after current task.')
  terminateRequested = true
})

// Track which dates we've already copied the client build for
const copiedDates = new Set<string>()
// Track which dates we've already generated the index for
const indexedDates = new Set<string>()
// Track the last eventId to detect changes
let lastEventId = ''
// Flag to indicate when index regeneration is needed
let regenerateIndexFlag = false
// Track when the index was last built
let lastIndexBuildTime = 0

async function safeWriteFile(filePath: string, data: any, label: string) {
  try {
    // Ensure the parent directory exists
    const parentDir = dirname(filePath);
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
      logger.info(`Created directory: ${parentDir}`);
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

async function exportLiveTimingData() {
  try {
    // Get the event date from the database
    const eventDate = await getEventDate();
    const dateStr = eventDate.format('YYYY-MM-DD');
    
    // Create the directory structure
    const baseDir = join(config.liveTimingOutputPath, dateStr)
    const apiDir = join(baseDir, 'api', 'simple')
    
    // Ensure directories exist
    if (!existsSync(apiDir)) {
      mkdirSync(apiDir, { recursive: true })
    }
    
    // Export competitor data
    const competitors = await getCompetitorJSON()
    await safeWriteFile(join(apiDir, 'competitors.json'), competitors, 'competitors.json')
    
    // Export current competitor data
    const currentCompetitor = await getCurrentCompetitor()
    await safeWriteFile(join(apiDir, 'currentCompetitor.json'), currentCompetitor, 'currentCompetitor.json')
    
    // Calculate the maximum number of runs for any competitor
    const maxRuns = Math.max(1, competitors.reduce((max, competitor) => {
      const competitorRuns = competitor.times.length;
      return competitorRuns > max ? competitorRuns : max;
    }, 0));
    
    // Export maxRuns to runs.json
    await safeWriteFile(join(apiDir, 'runs.json'), maxRuns, 'runs.json')
    
    logger.info(`Exported live timing data to ${apiDir}`)
  } catch (error) {
    logger.error('Failed to export live timing data:', error)
  }
}

/**
 * Generates an index.html file that organizes live timing data by year
 * and provides access to both current and historical events.
 */
async function generateIndexFile() {
  try {
    // Get the event date from the database
    const eventDate = await getEventDate();
    const dateStr = eventDate.format('YYYY-MM-DD');
    
    // Check if we have the necessary rsync configuration
    if (!config.rsyncRemoteHost || !config.rsyncRemoteUser || !config.rsyncRemotePath) {
      logger.warn('Rsync configuration is incomplete. Cannot generate index file from remote server.');
      return;
    }

    // Use SSH to list directories on the remote server
    const sshCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "ls -la ${config.rsyncRemotePath}/ | grep '^d' | grep -E '^d.*[0-9]{4}-[0-9]{2}-[0-9]{2}$' | awk '{print \\$9}'"`;
    
    logger.info(`Executing SSH command to list directories: ${sshCommand}`);
    const { stdout, stderr } = await execAsync(sshCommand);
    
    if (stderr) {
      logger.warn(`SSH command warnings: ${stderr}`);
    }
    
    // Parse the directory list
    const directories = stdout
      .trim()
      .split('\n')
      .filter(dir => dir && /^\d{4}-\d{2}-\d{2}$/.test(dir))
      .sort()
      .reverse(); // Most recent first
    
    if (directories.length === 0) {
      logger.warn('No date directories found on remote server, cannot generate index file');
      return;
    }
    
    logger.info(`Found ${directories.length} date directories on remote server`);

    // Build the live-timing index site
    await buildLiveTimingIndex();
    
    logger.info('Generated index file for event selection');
  } catch (error) {
    logger.error('Failed to generate index file:', error);
  }
}

/**
 * Gets the event date from the TPARAMETERS table
 * @returns The event date as a dayjs object, or the current date if not found
 */
async function getEventDate() {
  try {
    // Query the TPARAMETERS table for the DATE parameter
    const dateParam = await event.tPARAMETERS.findFirst({
      where: { C_PARAM: 'DATE' }
    });
    
    if (dateParam && dateParam.C_VALUE) {
      // Convert Excel serial date to JavaScript date
      // Excel dates are number of days since January 1, 1900
      // JavaScript dates are milliseconds since January 1, 1970
      const excelDate = Number(dateParam.C_VALUE);
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
      
      logger.info(`Found event date in database: ${dayjs(jsDate).format('YYYY-MM-DD')}`);
      return dayjs(jsDate);
    } else {
      logger.warn('No event date found in database, using current date');
      return dayjs();
    }
  } catch (error) {
    logger.error('Error getting event date from database:', error);
    return dayjs();
  }
}

/**
 * Writes a metadata.json file with event information
 * @param dateDirPath The directory path for the date
 * @param eventId The event ID
 */
async function writeMetadataFile(dateDirPath: string, eventId: string) {
  try {
    const metadataPath = join(dateDirPath, 'metadata.json')
    let eventName = 'Event'
    
    // Get the event name from the database
    try {
      const { event } = getEventDatabases(eventId)
      const title2Param = await event.tPARAMETERS.findFirst({
        where: { C_PARAM: 'TITLE2' }
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
      lastUpdated: new Date().toISOString()
    }
    
    await safeWriteFile(metadataPath, metadata, 'metadata.json')
    logger.info(`Wrote metadata file to ${metadataPath}`)
  } catch (error) {
    logger.error('Failed to write metadata file:', error)
  }
}

async function syncLiveTimingData() {
  // Check if uploadLiveTiming is enabled
  if (!config.uploadLiveTiming) {
    logger.info('Live timing upload is disabled, skipping sync')
    return
  }

  if (!config.rsyncRemoteHost || !config.rsyncRemoteUser || !config.rsyncRemotePath) {
    logger.warn('Rsync configuration is incomplete. Please check rsyncRemoteHost, rsyncRemoteUser, and rsyncRemotePath settings.')
    return
  }

  try {
    // Get the event date from the database
    const eventDate = await getEventDate();
    const dateStr = eventDate.format('YYYY-MM-DD');
    
    // Check if eventId has changed
    const eventIdChanged = lastEventId !== config.eventId;
    if (eventIdChanged) {
      logger.info(`Event ID changed from ${lastEventId} to ${config.eventId}, forcing directory recreation`);
      // Clear the copied dates to force recreation
      copiedDates.clear();
      indexedDates.clear();
      lastEventId = config.eventId;
      // Set the regenerate flag when eventId changes
      regenerateIndexFlag = true;
    }
    
    // Define the specific date directory to sync
    const dateDirPath = join(config.liveTimingOutputPath, dateStr)
    const apiDirPath = join(dateDirPath, 'api', 'simple')
    
    // Export live timing data to ensure the API directory has content
    logger.info('Exporting live timing data')
    await exportLiveTimingData()
    
    // Write metadata file with event information
    logger.info('Writing metadata file')
    await writeMetadataFile(dateDirPath, config.eventId)
    
    // Check if this is the first run for this date or if eventId changed
    const isFirstRun = !copiedDates.has(dateStr) || eventIdChanged;
    
    // Determine if we need to build the index
    const currentTime = Date.now();
    const timeSinceLastBuild = currentTime - lastIndexBuildTime;
    const shouldBuildIndex = regenerateIndexFlag || 
                            (isFirstRun && !indexedDates.has(dateStr)) || 
                            timeSinceLastBuild > 3600000; // Rebuild every hour at most
    
    // If we need to build the index, do it once
    if (shouldBuildIndex) {
      logger.info('Building index file');
      await buildLiveTimingIndex();
      lastIndexBuildTime = currentTime;
      indexedDates.add(dateStr);
      
      // Sync the index file to the remote server
      logger.info('Syncing index file to remote server');
      await rsyncService.sync({
        source: join(config.liveTimingOutputPath, 'index.html'),
        destination: config.rsyncRemotePath,
        exclude: ['*.tmp', '*.log'],
        delete: false,
        isFile: true
      });
      logger.info('Successfully synced index file to remote server');
      
      // Reset the flag after regeneration
      regenerateIndexFlag = false;
    } else {
      logger.info('Skipping index build - already up to date');
    }
    
    if (isFirstRun) {
      logger.info(`First run for ${dateStr} or event ID changed - performing full sync`)
      
      // Copy the client build to the data directory
      const clientBuildSource = join(__dirname, '..','..', 'dist', 'server', 'ui')
      const displayDestPath = join(dateDirPath, 'display')
      
      logger.info(`Copying client build from ${clientBuildSource} to ${displayDestPath}`)
      
      // Create the destination directory if it doesn't exist
      if (!existsSync(displayDestPath)) {
        mkdirSync(displayDestPath, { recursive: true })
      } else {
        // If the directory exists, remove it to ensure a clean copy
        logger.info(`Removing existing display directory for ${dateStr} to ensure a clean copy`)
        rmSync(displayDestPath, { recursive: true, force: true })
        mkdirSync(displayDestPath, { recursive: true })
      }
      
      // Copy the client build to the display directory
      cpSync(clientBuildSource, displayDestPath, { recursive: true })
      logger.info('Client build copied successfully')
      
      // Mark this date as copied
      copiedDates.add(dateStr)
    } else {
      logger.info(`Subsequent run for ${dateStr} - only updating and syncing API data`)
    }
    
    // Always sync the API directory to ensure data is available quickly
    logger.info(`Starting rsync of API directory to date-specific location`)
    await rsyncService.sync({
      source: apiDirPath,
      destination: join(config.rsyncRemotePath, dateStr, 'api', 'simple'),
      exclude: ['*.tmp', '*.log'],
      delete: true
    })
    logger.info(`Successfully synced API directory to date-specific location`)
    
    // Also sync API to the live-timing directory for current day access
    logger.info(`Starting rsync of API directory to live-timing directory`)
    await rsyncService.sync({
      source: apiDirPath,
      destination: join(config.rsyncRemotePath, 'live-timing', 'api', 'simple'),
      exclude: ['*.tmp', '*.log'],
      delete: true
    })
    logger.info(`Successfully synced API directory to live-timing directory`)
    
  } catch (error) {
    logger.error('Failed to sync live timing data to remote server:', error)
  }
}

export { syncLiveTimingData }

export async function executeScheduledTasks() {
  logger.info('Task Scheduler called')

  if (config.uploadLiveTiming) {
    logger.info('Uploading live timing enabled — proceeding with upload')
    // Only call syncLiveTimingData, which now handles exporting data internally
    await syncLiveTimingData()
  } else {
    logger.info('Live timing upload is disabled')
  }
}

// Function to set the regenerate index flag
export function setRegenerateIndexFlag() {
  logger.info('Setting regenerate index flag')
  regenerateIndexFlag = true
}

// Other scheduled tasks can be added here
  // Check for new records
  // for (let i = 1; i < Number(config.eventId); i++) {
  //   const processingEventId = ('000' + i).slice(-3)
  //   logger.info(processingEventId)
  //   const { event, eventData } = getEventDatabases(processingEventId)
  //   const date = (await event.tPARAMETERS.findFirst({
  //     where: { C_PARAM: 'DATE' },
  //   })) || { C_PARAM: 'DATE', C_VALUE: 0 }
  //   await event.$disconnect()
  //   await eventData.$disconnect()
  //   if (date.C_VALUE !== null) {
  //     logger.info(new Date((Number(date.C_VALUE) - (25567 + 1)) * 86400 * 1000))
  //   }
  // }

