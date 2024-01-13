/// <reference types="@total-typescript/ts-reset" />

import type {
  Competitor,
  CompetitorList,
  TimeInfo,
} from 'server/src/router/objects'

const REALLY_LARGE_NUMBER = Number.MAX_SAFE_INTEGER

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

interface BestTimeProps {
  previousBestFinishTime: number
  bestFinishTime: number
  defaultBest: number
  bestFinishTimeOfTheDay: number
  bestFinishTimeOfTheDayName: string
  bestFinishTimeOfTheDayCar: string
  bestFinishTimeOfTheDayLady: number
  bestFinishTimeOfTheDayLadyName: string
  bestFinishTimeOfTheDayLadyCar: string
  bestFinishTimeOfTheDayJunior: number
  bestFinishTimeOfTheDayJuniorName: string
  bestFinishTimeOfTheDayJuniorCar: string
}

export interface BestSectorTimes {
  bestSector1: number
  bestSector2: number
  bestSector3: number

  previousBestSector1: number
  previousBestSector2: number
  previousBestSector3: number
}

/**
 * Returns the two best times
 */
function getTopTimes(times: number[]): [number, number] {
  const sortedTimes = times.filter((time) => time > 0).sort((a, b) => a - b)
  return [sortedTimes[0], sortedTimes[1]]
}

function getBest(competitors: CompetitorList): BestSectorTimes {
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

export const getGlobalBest = getBest
export const getPersonalBest = (competitor: Competitor) => getBest([competitor])
export const getClassBest = (classIndex: number, competitors: CompetitorList) =>
  getBest(
    competitors.filter((competitors) => competitors.classIndex === classIndex)
  )

export interface PersonalBestTotal {
  previousPersonalBestFinishTime: number
  personalBestFinishTime: number
}

export function getPersonalBestTotal(
  competitor: Competitor
): PersonalBestTotal {
  let personalBestFinishTime = REALLY_LARGE_NUMBER
  let previousPersonalBestFinishTime = REALLY_LARGE_NUMBER

  for (const run of competitor.times) {
    if (typeof run == 'undefined' || run.status != 0) continue

    const finishTime = run.time

    if (finishTime > 0 && finishTime < personalBestFinishTime) {
      previousPersonalBestFinishTime = personalBestFinishTime
      personalBestFinishTime = finishTime
    }
  }

  return {
    previousPersonalBestFinishTime,
    personalBestFinishTime,
  }
}

/** @deprecated */
export function RankTimes(
  currentRun: Competitor,
  allRuns: CompetitorList
): BestTimeProps {
  let split1 = 0.0
  let split2 = 0.0
  let time = 0.0

  const defaultBest = REALLY_LARGE_NUMBER

  let bestSector1 = defaultBest
  let bestSector2 = defaultBest
  let bestSector3 = defaultBest
  let bestFinishTime = defaultBest
  let previousBestFinishTime = defaultBest
  let personalBestSector1 = defaultBest
  let personalBestSector2 = defaultBest
  let personalBestSector3 = defaultBest
  let personalBestFinishTime = defaultBest
  let bestFinishTimeOfTheDay = defaultBest
  let bestFinishTimeOfTheDayName = ''
  let bestFinishTimeOfTheDayCar = ''
  let bestFinishTimeOfTheDayLady = defaultBest
  let bestFinishTimeOfTheDayLadyName = ''
  let bestFinishTimeOfTheDayLadyCar = ''
  let bestFinishTimeOfTheDayJunior = defaultBest
  let bestFinishTimeOfTheDayJuniorName = ''
  let bestFinishTimeOfTheDayJuniorCar = ''

  // Personal Bests
  //
  for (const run of currentRun.times) {
    if (typeof run !== 'undefined' && run.status === 0) {
      split1 = run.split1
      split2 = run.split2
      time = run.time
      if (run.split1 < personalBestSector1 && run.split1 > 0) {
        personalBestSector1 = run.split1
      }
      if (run.split2 - run.split1 < personalBestSector2 && run.split2 > 0) {
        personalBestSector2 = run.split2 - run.split1
      }
      if (run.time - run.split2 < personalBestSector3 && run.time > 0) {
        personalBestSector3 = run.time - run.split2
      }
      if (run.time < personalBestFinishTime && run.time > 0) {
        personalBestFinishTime = run.time
      }
    } else {
      split1 = 0
      split2 = 0
      time = 0
    }
  }

  for (const person of allRuns) {
    // Class best times
    if (person.classIndex === currentRun.classIndex) {
      for (const run of person.times) {
        if (typeof run !== 'undefined' && run.status === 0) {
          if (run.split1 < bestSector1) {
            bestSector1 = run.split1
          }
          if (run.split2 - run.split1 < bestSector2) {
            bestSector2 = run.split2 - run.split1
          }
          if (run.time - run.split2 < bestSector3) {
            bestSector3 = run.time - run.split2
          }
          if (run.time < bestFinishTime) {
            previousBestFinishTime = bestFinishTime
            bestFinishTime = run.time
          }
        }
      }
    }
    // Best time of the day
    for (const run of person.times) {
      if (typeof run !== 'undefined' && run.status === 0) {
        if (
          run.status === 0 &&
          run.time > 0 &&
          run.time < bestFinishTimeOfTheDay
        ) {
          bestFinishTimeOfTheDay = run.time
          bestFinishTimeOfTheDayName = person.firstName + ' ' + person.lastName
          bestFinishTimeOfTheDayCar = person.vehicle
        }
      }
      if (typeof run !== 'undefined' && typeof person.special !== 'undefined') {
        if (
          person.special.toString().toLowerCase().includes('lady') ||
          person.special.toString().toLowerCase().includes('female')
        ) {
          if (
            run.status === 0 &&
            run.time > 0 &&
            run.time < bestFinishTimeOfTheDayLady
          ) {
            bestFinishTimeOfTheDayLady = run.time
            bestFinishTimeOfTheDayLadyName =
              person.firstName + ' ' + person.lastName
            bestFinishTimeOfTheDayLadyCar = person.vehicle
          }
        }
        if (person.special.toString().toLowerCase().includes('junior')) {
          if (
            run.status === 0 &&
            run.time > 0 &&
            run.time < bestFinishTimeOfTheDayJunior
          ) {
            bestFinishTimeOfTheDayJunior = run.time
            bestFinishTimeOfTheDayJuniorName =
              person.firstName + ' ' + person.lastName
            bestFinishTimeOfTheDayJuniorCar = person.vehicle
          }
        }
      }
    }
  }

  return {
    bestFinishTime,
    previousBestFinishTime,
    defaultBest,
    bestFinishTimeOfTheDay,
    bestFinishTimeOfTheDayName,
    bestFinishTimeOfTheDayCar,
    bestFinishTimeOfTheDayLady,
    bestFinishTimeOfTheDayLadyName,
    bestFinishTimeOfTheDayLadyCar,
    bestFinishTimeOfTheDayJunior,
    bestFinishTimeOfTheDayJuniorName,
    bestFinishTimeOfTheDayJuniorCar,
  }
}

export type SectorColors = 'purple' | 'green' | 'yellow' | 'background.default'

export function getColor(
  classBest: number,
  personalBest: number,
  time: number
): 'purple' | 'green' | 'yellow' | 'background.default' {
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
  previousPB: number
  globalBest: number
  previousGlobalBest: number
}): { deltaPB: number; deltaLeader: number } {
  return {
    deltaPB: time == pb ? time - previousPB : time - pb,
    deltaLeader:
      time == globalBest ? time - previousGlobalBest : time - globalBest,
  }
}
