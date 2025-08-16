/// <reference types="@total-typescript/ts-reset" />

import type {
  Competitor,
  CompetitorList,
  TimeInfo,
} from 'server/src/router/objects.js'

export interface Splits {
  split1: number
  split2: number
  finish: number
}

export type Times = {
  sector1: number
  sector2: number
  sector3: number
  finish: number
}

export interface BestSectorTimes {
  bestSector1: number
  bestSector2: number
  bestSector3: number
  bestFinish: number

  previousBestSector1: number | null
  previousBestSector2: number | null
  previousBestSector3: number | null
  previousBestFinish: number | null
}

/**
 * Returns the two best times
 */
function getTopTimes(times: number[]): [number, number | null] {
  const sortedTimes = times.filter((time) => time > 0).sort((a, b) => a - b)
  if (sortedTimes.length === 0) return [0, null]
  if (sortedTimes.length === 1) return [sortedTimes[0], null]
  return [sortedTimes[0], sortedTimes[1]]
}

function getBestSectors(competitors: CompetitorList): BestSectorTimes {
  const runs = competitors
    .flatMap((competitor) => competitor.times)
    .filter(Boolean)

  const [bestSector1, previousBestSector1] = getTopTimes(
    runs.map((run) => run.split1)
  )
  const [bestSector2, previousBestSector2] = getTopTimes(
    runs.map((run) => run.split2 - run.split1)
  )
  const [bestSector3, previousBestSector3] = getTopTimes(
    runs.map((run) => run.time - run.split2)
  )
  const [bestFinish, previousBestFinish] = getTopTimes(
    runs.map((run) => run.time)
  )

  return {
    bestSector1,
    bestSector2,
    bestSector3,
    bestFinish,

    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
    previousBestFinish,
  }
}

export const getGlobalBestSectors = getBestSectors
export const getPersonalBestSectors = (competitor: Competitor) =>
  getBestSectors([competitor])
export const getClassBestSectors = (
  classIndex: number,
  competitors: CompetitorList
) =>
  getBestSectors(
    competitors.filter((competitors) => competitors.classIndex === classIndex)
  )

export const getPersonalBestTotal = (competitor: Competitor) =>
  getTopTimes(competitor.times.filter(Boolean).map((run) => run.time))

export type BestFinish = { name: string; car: string; time: number }

export function getBestN(
  competitors: CompetitorList,
  count: number
): BestFinish[] {
  // create a new array of objects with the competitor and their best time
  // filter out any competitors that have no times
  // sort the array by the best time
  // get the first element of the array
  // if there is no best run, return an empty object
  // return the best run's competitor's name, car, and time

  const competitorBestRuns = competitors
    .map((competitor) => ({
      competitor,
      best: competitor.times
        .filter(Boolean)
        .filter((time) => time.status === 0)
        .filter((time) => time.time !== 0)
        .sort((a, b) => a.time - b.time)[0],
    }))
    .filter((run) => run.best !== undefined)

  return competitorBestRuns
    .sort((a, b) => a.best.time - b.best.time)
    .slice(0, count)
    .map(({ competitor, best }) => ({
      name: competitor.firstName + ' ' + competitor.lastName,
      car: competitor.vehicle,
      time: best.time,
    }))
}

const getBestFinish = (competitors: CompetitorList) => {
  const bestRuns = getBestN(competitors, 1);
  return bestRuns.length > 0 ? bestRuns[0] : { name: 'No times yet', car: '', time: 0 };
}

export type GetBestFinish = typeof getBestFinish
export const getGlobalBestFinish = getBestFinish
export const getFemaleBestFinish = (competitors: CompetitorList) =>
  getBestFinish(
    competitors.filter((competitor) => {
      const special = competitor.special?.toLowerCase()
      return special?.includes('lady') || special?.includes('female')
    })
  )
export const getJuniorBestFinish = (competitors: CompetitorList) =>
  getBestFinish(
    competitors.filter((competitor) => {
      const special = competitor.special?.toLowerCase()
      return special?.includes('junior')
    })
  )

export type SectorColors = 'purple' | 'green' | 'yellow' | 'background.default'

export function getColor(
  classBest: number,
  personalBest: number,
  time: number
): SectorColors {
  if (time <= 0) return 'background.default'

  if (time <= classBest) return 'purple'
  if (time <= personalBest) return 'green'
  return 'yellow'
}

function getSectorColor(
  bestSector: number,
  personalBestSector: number,
  time: number
): SectorColors {
  if (time <= 0) return 'background.default'

  if (time <= bestSector) return 'purple'
  if (time <= personalBestSector) return 'green'
  return 'yellow'
}

export function getSectorColors(
  classBest: BestSectorTimes,
  pb: BestSectorTimes,
  times: Times
): Record<'first' | 'second' | 'third' | 'finish', SectorColors> {
  return {
    first: getSectorColor(classBest.bestSector1, pb.bestSector1, times.sector1),
    second: getSectorColor(
      classBest.bestSector2,
      pb.bestSector2,
      times.sector2
    ),
    third: getSectorColor(classBest.bestSector3, pb.bestSector3, times.sector3),
    finish: getSectorColor(classBest.bestFinish, pb.bestFinish, times.finish),
  }
}

export function calculateTimes(times: TimeInfo): Times {
  return {
    sector1: times.split1,
    sector2: times.split2 - times.split1,
    sector3: times.time - times.split2,
    finish: times.time,
  }
}

export function calculateDeltas({
  time,
  pb,
  previousPB,
  classBest,
  previousClassBest,
}: {
  time: number
  pb: number
  previousPB: number | null
  classBest: number
  previousClassBest: number | null
}): { deltaPB: number; deltaClassLeader: number } {
  if (!previousPB || !previousClassBest) {
    return { deltaPB: 0, deltaClassLeader: 0 }
  }

  return {
    deltaPB: time == pb ? time - previousPB : time - pb,
    deltaClassLeader:
      time == classBest ? time - previousClassBest : time - classBest,
  }
}
