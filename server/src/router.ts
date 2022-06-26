import { router, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { join } from 'path'

import { PrismaClient as pcEvent } from '../prisma/generated/event'
import { PrismaClient as pcEventData } from '../prisma/generated/eventData'
import { nullToUndefined } from './utils'

const EVENT_ID = '049'
const eventPath = join(__dirname, '..', 'prisma/Events')

const event = new pcEvent({
  datasources: {
    db: {
      url: `file:${join(eventPath, `Event${EVENT_ID}.scdb`)}`,
    },
  },
})

const eventData = new pcEventData({
  datasources: {
    db: {
      url: `file:${join(eventPath, `Event${EVENT_ID}Ex.scdb`)}`,
    },
  },
})

const Competitor = z.object({
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  class: z.string(),
  vehicle: z.string(),
  classRecord: z.string(),
  special: z.optional(z.string()),
  miscAward: z.optional(z.string()),
})

const CompetitorList = z.array(Competitor)

export type Competitor = z.infer<typeof Competitor>
export type CompetitorList = z.infer<typeof CompetitorList>

export const competitors = router().query('list', {
  output: CompetitorList,
  async resolve(req) {
    const competitors: CompetitorList = (
      await event.tCOMPETITORS.findMany()
    ).map((competitor) => ({
      number: competitor.C_NUM || -1,
      firstName: competitor.C_FIRST_NAME || 'N/A',
      lastName: competitor.C_LAST_NAME || 'N/A',
      class: competitor.C_SERIE || 'N/A',
      vehicle: competitor.C_COMMITTEE || 'N/A',
      classRecord: competitor.C_TEAM || '0.00',
      special: nullToUndefined(competitor.C_I28),
      miscAward: nullToUndefined(competitor.C_I30),
    }))

    return competitors
  },
})

// export const records = router().query('list', {
//   output: RecordsList,
//   async resolve(req) {
//     const records: RecordsList = (await event.tCOMPETITORS.findMany()).map(
//       (competitor) => ({
//         number: competitor.C_NUM || -1,
//         firstName: competitor.C_FIRST_NAME || 'N/A',
//         lastName: competitor.C_LAST_NAME || 'N/A',
//         class: competitor.C_SERIE || 'N/A',
//         vehicle: competitor.C_COMMITTEE || 'N/A',
//         classRecord: nullToUndefined(competitor.C_TEAM),
//         special: nullToUndefined(competitor.C_I28),
//         miscAward: nullToUndefined(competitor.C_I30),
//       })
//     )
//
//     return records
//   },
// })

export const trpcRouter = router().merge('competitors.', competitors)

export type TRPCRouter = typeof trpcRouter
