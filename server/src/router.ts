import { router, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

// import { PrismaClient as pcEventData } from '../prisma/generated/eventData'
// const eventData = new pcEventData()

// import { PrismaClient as pcEvent } from '../prisma/generated/event'
// const event = new pcEvent()

const prisma = new PrismaClient()

const Hello = z.object({
  id: z.number(),
  text: z.string(),
  language: z.string(),
})

const HelloList = z.array(Hello)

export type Hello = z.infer<typeof Hello>
export type HelloList = z.infer<typeof HelloList>

export const trpcRouter = router()
  .query('get', {
    input: z.number(),
    output: Hello,
    async resolve(req) {
      const foundHello = await prisma.hello.findUnique({
        where: {
          id: req.input,
        },
      })

      if (!foundHello) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find hello with id ${req.input}`,
        })
      }

      return foundHello as Hello
    },
  })
  .query('list', {
    output: HelloList,
    async resolve() {
      // return hellos
      return (await prisma.hello.findMany()).map((lang) => lang as Hello)
    },
  })

export type TRPCRouter = typeof trpcRouter
