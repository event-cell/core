import { z } from 'zod'

const TimeInfo = z
  .object({
    run: z.number(),
    status: z.number(),
    time: z.number(),
    split1: z.number(),
    split2: z.number(),
  })
  .optional()

export const TimeInfoMandatory = z.object({
  run: z.number(),
  status: z.number(),
  time: z.number(),
  split1: z.number(),
  split2: z.number(),
})

export const TimeInfoList = z.array(TimeInfo)
export type TimeInfoMandatory = z.infer<typeof TimeInfoMandatory>
export type TimeInfoList = z.infer<typeof TimeInfoList>

export const Competitor = z.object({
  number: z.number(),
  lastName: z.string(),
  firstName: z.string(),
  class: z.string(),
  /**
   * The idenfier for a specific class
   */
  classIndex: z.number(),
  vehicle: z.string(),
  classRecord: z.string(),
  special: z.optional(z.string()),
  miscAward: z.optional(z.string()),
  times: TimeInfoList,
})
export const CompetitorList = z.array(Competitor)
export type Competitor = z.infer<typeof Competitor>
export type CompetitorList = z.infer<typeof CompetitorList>
