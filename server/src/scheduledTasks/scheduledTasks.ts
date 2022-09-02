import { setupLogger } from './../utils'
import { config } from '../config'
import { getEventDatabases } from '../dbUtils'

const logger = setupLogger('scheduledTasks/scheduledTasks')

export async function executeScheduledTasks() {
  logger.info('Task Scheduler called')
  // Check for new records
  for (let i = 1; i < Number(config.eventId); i++) {
    const processingEventId = ('000' + i).slice(-3)
    logger.info(processingEventId)
    const { event, eventData } = getEventDatabases(processingEventId)
    const date = (await event.tPARAMETERS.findFirst({
      where: { C_PARAM: 'DATE' },
    })) || { C_PARAM: 'DATE', C_VALUE: 0 }
    await event.$disconnect()
    await eventData.$disconnect()
    if (date.C_VALUE !== null) {
      logger.info(new Date((Number(date.C_VALUE) - (25567 + 1)) * 86400 * 1000))
    }
  }
}
