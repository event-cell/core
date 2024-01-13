/// <reference types="@total-typescript/ts-reset" />

import type {
  Competitor,
  CompetitorList,
  TimeInfo,
} from 'server/src/router/objects'

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

  previousBestSector1: number | null
  previousBestSector2: number | null
  previousBestSector3: number | null
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

  return {
    bestSector1,
    bestSector2,
    bestSector3,

    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
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
export const getBestFinishTheWorseVersion = (competitors: CompetitorList) =>
  getTopTimes(
    competitors
      .flatMap((competitor) => competitor.times)
      .filter(Boolean)
      .map((run) => run.time)
  )

export type BestFinish = { name: string; car: string; time: number }

function getBestFinish(competitors: CompetitorList): BestFinish {
  const competitorBestRuns = competitors
    .map((competitor) => ({
      competitor,
      best: competitor.times.filter(Boolean).sort((a, b) => a.time - b.time)[0],
    }))
    .filter(Boolean)

  const bestRun = competitorBestRuns.sort(
    (a, b) => a.best.time - b.best.time
  )[0]

  return {
    name: bestRun.competitor.firstName + ' ' + bestRun.competitor.lastName,
    car: bestRun.competitor.vehicle,
    time: bestRun.best.time,
  }
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
    finish: getSectorColor(classBest.bestSector3, pb.bestSector3, times.finish),
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
  globalBest,
  previousGlobalBest,
}: {
  time: number
  pb: number
  previousPB: number | null
  globalBest: number
  previousGlobalBest: number | null
}): { deltaPB: number; deltaLeader: number } {
  if (!previousPB || !previousGlobalBest) {
    return { deltaPB: 0, deltaLeader: 0 }
  }

  return {
    deltaPB: time == pb ? time - previousPB : time - pb,
    deltaLeader:
      time == globalBest ? time - previousGlobalBest : time - globalBest,
  }
}
