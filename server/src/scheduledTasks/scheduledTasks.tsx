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
    
    // Export current heat data
    const currentHeat = await getCurrentHeat()
    await safeWriteFile(join(apiDir, 'runs.json'), currentHeat, 'runs.json')
    
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

    // Group directories by year
    const directoriesByYear: Record<string, string[]> = {};
    directories.forEach(dir => {
      const year = dir.substring(0, 4);
      if (!directoriesByYear[year]) {
        directoriesByYear[year] = [];
      }
      directoriesByYear[year].push(dir);
    });

    // Sort years in descending order
    const years = Object.keys(directoriesByYear).sort().reverse();

    // Generate HTML content
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SDMA Live Timing</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background-color: #121212;
      color: #fff;
    }
    h1 {
      color: #fff;
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      color: #fff;
      margin-top: 0;
    }
    .current-event {
      background-color: #1e3a5f;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #1976d2;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .current-event-button {
      display: inline-block;
      background-color: #1976d2;
      color: white;
      padding: 15px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      border: 2px solid transparent;
    }
    .current-event-button:hover {
      background-color: #1565c0;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
      border-color: #90caf9;
    }
    .current-event-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .year-section {
      margin-bottom: 20px;
    }
    .year-header {
      background-color: #1e1e1e;
      padding: 15px;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #333;
      transition: background-color 0.3s;
    }
    .year-header:hover {
      background-color: #2c2c2c;
    }
    .year-content {
      display: none;
      padding: 15px;
      border-left: 2px solid #333;
      margin-left: 10px;
      background-color: #1a1a1a;
      border-radius: 0 0 8px 8px;
    }
    .year-content.active {
      display: block;
    }
    .event-link {
      display: block;
      padding: 12px;
      margin: 8px 0;
      text-decoration: none;
      color: #fff;
      border-radius: 4px;
      background-color: #2c2c2c;
      transition: background-color 0.3s, transform 0.2s;
    }
    .event-link:hover {
      background-color: #3c3c3c;
      transform: translateX(5px);
    }
    .event-date {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .event-name {
      font-size: 14px;
      color: #aaa;
    }
    .toggle-icon {
      font-size: 18px;
      color: #1976d2;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 500;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      font-size: 28px;
    }
    .description {
      color: #aaa;
      margin-bottom: 30px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #333;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <span class="material-icons logo-icon">timer</span>
      SDMA Live Timing
    </div>
  </div>
  
    <div class="current-event">
    <h2>Current Event</h2>
    <a href="live-timing/display/" class="current-event-button">View Live Timing</a>
  </div>
  
  <h2>Historical Events</h2>`;

    // Add each year section
    years.forEach(year => {
      html += `
  <div class="year-section">
    <div class="year-header" onclick="toggleYear('${year}')">
      <span>${year}</span>
      <span class="toggle-icon" id="toggle-${year}">▼</span>
    </div>
    <div class="year-content" id="year-${year}">`;
      
      // Add each event in the year
      directoriesByYear[year].forEach(dir => {
        const date = dayjs(dir);
        const formattedDate = date.format('MMMM D, YYYY');
        
        // Get event name from metadata if available
        let eventName = '';
        try {
          const metadataPath = join(config.liveTimingOutputPath, dir, 'metadata.json');
          if (existsSync(metadataPath)) {
            const metadataContent = readFileSync(metadataPath, 'utf8');
            const metadata = JSON.parse(metadataContent) as { eventName?: string };
            if (metadata.eventName) {
              eventName = metadata.eventName;
            }
          }
        } catch (error) {
          logger.warn(`Could not read metadata for ${dir}: ${error}`);
        }
        
        html += `
      <a href="${dir}/display/" class="event-link">
        <div class="event-date">${formattedDate}</div>
        ${eventName ? `<div class="event-name">${eventName}</div>` : ''}
      </a>`;
      });
      
      html += `
    </div>
  </div>`;
    });

    // Add JavaScript for toggling year sections
    html += `
  <div class="footer">
    <p>Event Cell Live Timing System</p>
  </div>
  
  <script>
    function toggleYear(year) {
      const content = document.getElementById('year-' + year);
      const toggle = document.getElementById('toggle-' + year);
      
      if (content.classList.contains('active')) {
        content.classList.remove('active');
        toggle.textContent = '▼';
      } else {
        content.classList.add('active');
        toggle.textContent = '▲';
      }
    }
  </script>
</body>
</html>`;

    // Write the index file to the output path
    const indexPath = join(config.liveTimingOutputPath, 'index.html');
    writeFileSync(indexPath, html);
    logger.info(`Generated index file at ${indexPath}`);
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
    
    if (isFirstRun) {
      logger.info(`First run for ${dateStr} or event ID changed - performing full sync`)
      
      // Copy the client build to the data directory
      const clientBuildSource = join(__dirname, '..', '..', '..', 'client', 'build')
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
      
      // Generate the index file
      await generateIndexFile();
      logger.info('Generated index file for event selection');
      indexedDates.add(dateStr)
      
      // Sync the entire date directory to its date-specific location
      logger.info(`Starting rsync of ${dateStr} directory to date-specific location`)
      await rsyncService.sync({
        source: dateDirPath,
        destination: join(config.rsyncRemotePath, dateStr),
        exclude: ['*.tmp', '*.log'],
        delete: true
      })
      logger.info(`Successfully synced ${dateStr} directory to date-specific location`)
      
      // Also sync to the live-timing directory for current day access
      logger.info(`Starting rsync of ${dateStr} directory to live-timing directory`)
      await rsyncService.sync({
        source: dateDirPath,
        destination: join(config.rsyncRemotePath, 'live-timing'),
        exclude: ['*.tmp', '*.log'],
        delete: true
      })
      logger.info(`Successfully synced ${dateStr} directory to live-timing directory`)
      
      // Sync the index file to the remote server
      logger.info('Syncing index file to remote server');
      await rsyncService.sync({
        source: join(config.liveTimingOutputPath, 'index.html'),
        destination: join(config.rsyncRemotePath, 'index.html'),
        exclude: ['*.tmp', '*.log'],
        delete: false,
        isFile: true
      });
      logger.info('Successfully synced index file to remote server');
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

