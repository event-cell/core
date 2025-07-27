import { join } from 'path'
import { existsSync, statSync } from 'fs'

import { PrismaClient as pcEvent } from './prisma/generated/event/index.js'
import { PrismaClient as pcEventData } from './prisma/generated/eventData/index.js'
import { PrismaClient as pcOnline } from './prisma/generated/online/index.js'

import { config } from './config.js'

export type EventDB = {
  event: pcEvent
  eventData: pcEventData
  online: pcOnline | null
}

export function getEventDatabases(eventId: string): EventDB {
  const eventPath = config.eventDatabasePath

  let online: EventDB['online'] = null

  try {
    // Check if the Online.scdb file exists and has content
    const onlineDbPath = join(eventPath, `Online.scdb`)

    if (existsSync(onlineDbPath) && statSync(onlineDbPath).size > 0) {
      online = new pcOnline({
        datasources: {
          db: {
            url: `file:${onlineDbPath}`,
          },
        },
      })
    } else {
      console.warn('Online.scdb file is empty or does not exist, skipping online database connection')
    }
  } catch (error) {
    console.warn('Failed to connect to online database:', error)
  }

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
