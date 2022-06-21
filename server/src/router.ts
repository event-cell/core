import { router, TRPCError } from '@trpc/server'
import { z } from 'zod'

const hellos: Hello[] = [
  {
    id: 1,
    text: 'Hello',
    language: 'en',
  },
]

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
      const foundHello = hellos.find((hello) => hello.id === req.input)

      if (!foundHello) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find hello with id ${req.input}`,
        })
      }

      return foundHello
    },
  })
  .query('list', {
    output: HelloList,
    async resolve() {
      return hellos
    },
  })

export type TRPCRouter = typeof trpcRouter
