import { setupLogger } from './../utils'
const logger = setupLogger('scheduledTasks/scheduledTasks')

export async function executeScheduledTasks() {
  logger.info('Task Scheduler called')
}
