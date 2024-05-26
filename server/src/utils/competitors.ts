import { Competitor, CompetitorList } from '../router/objects'

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

export const getPersonalBestSectors = (competitor: Competitor) =>
  getBestSectors([competitor])
