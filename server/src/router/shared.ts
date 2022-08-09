import { config } from '../config'
import { getEventDatabases } from '../dbUtils'

export let { event, eventData } = getEventDatabases(config.eventId)
