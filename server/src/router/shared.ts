import { config } from '../config'
import { EventDB, getEventDatabases } from '../dbUtils'

export let { event, eventData } = getEventDatabases(config.eventId)

export function setNewEvent(eventDB: EventDB) {
  event = eventDB.event
  eventData = eventDB.eventData
}
