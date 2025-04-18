import { setupLogger } from '../utils'

const logger = setupLogger('scheduledTasks/scheduledTasks')
import { config } from '../config'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import dayjs from 'dayjs'
import { getCompetitorJSON } from '../router/shared'
import { getCurrentCompetitor } from '../router/currentCompetitor'
import { getCurrentHeat } from '../utils'

let terminateRequested = false
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received — will exit after current task.')
  terminateRequested = true
})

async function safeWriteFile(filePath: string, data: any, label: string) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2))
    logger.info(`✅ Wrote ${label} to ${filePath}`)
  } catch (error: any) {
    logger.error(`❌ Failed to write ${label}: ${error.message}`)
  }
}

async function exportLiveTimingData() {
  const dateStr = dayjs().format('YYYY-MM-DD')
  const basePath = join(config.liveTimingOutputPath, dateStr, 'api', 'simple')

  try {
    if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true })
  } catch (e: any) {
    logger.error(`❌ Failed to create output directory: ${e.message}`)
    return
  }

  if (terminateRequested) return

  try {
    const competitors = await getCompetitorJSON()
    await safeWriteFile(join(basePath, 'competitors.json'), competitors, 'competitors.json')
  } catch (e: any) {
    logger.error(`❌ Error retrieving competitors: ${e.message}`)
  }

  if (terminateRequested) return

  try {
    const currentCompetitor = await getCurrentCompetitor()
    await safeWriteFile(join(basePath, 'currentCompetitor.json'), currentCompetitor, 'currentCompetitor.json')
  } catch (e: any) {
    logger.error(`❌ Error retrieving current competitor: ${e.message}`)
  }

  if (terminateRequested) return

  try {
    const runs = await getCurrentHeat()
    await safeWriteFile(join(basePath, 'runs.json'), runs, 'runs.json')
  } catch (e: any) {
    logger.error(`❌ Error retrieving run count: ${e.message}`)
  }
}

export async function executeScheduledTasks() {
  logger.info('Task Scheduler called')

  if (config.uploadLiveTiming) {
    logger.info('Uploading live timing enabled — proceeding with upload')
    await exportLiveTimingData()
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

