import { join } from 'path'

import { PrismaClient as pcEvent } from '../prisma/generated/event'
import { PrismaClient as pcEventData } from '../prisma/generated/eventData'
import { config } from './config'

export type EventDB = {
  event: pcEvent
  eventData: pcEventData
}

export function getEventDatabases(eventId: string): EventDB {
  const eventPath = config.eventDatabasePath

  return {
    event: new pcEvent({
      datasources: {
        db: {
          url: `file:${join(eventPath, `Event${eventId}.scdb`)}`,
        },
      },
    }),
    eventData: new pcEventData({
      datasources: {
        db: {
          url: `file:${join(eventPath, `Event${eventId}Ex.scdb`)}`,
        },
      },
    }),
  }
}
