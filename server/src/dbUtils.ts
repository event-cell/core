import { join } from 'path'

import { PrismaClient as pcEvent } from '../prisma/generated/event'
import { PrismaClient as pcEventData } from '../prisma/generated/eventData'
import { PrismaClient as pcOnline } from '../prisma/generated/online'

import { config } from './config'

export type EventDB = {
  event: pcEvent
  eventData: pcEventData
  online: pcOnline | null
}

export function getEventDatabases(eventId: string): EventDB {
  const eventPath = config.eventDatabasePath

  let online: EventDB['online'] = null

  try {
    online = new pcOnline({
      datasources: {
        db: {
          url: `file:${join(eventPath, `Online.scdb`)}`,
        },
      },
    })
  }
  catch {}

  return {
    online,
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
