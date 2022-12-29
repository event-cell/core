import {
  Competitor,
  CompetitorList,
  TimeInfoManditory,
} from 'server/src/router/objects'

const REALLY_LARGE_NUMBER = Number.MAX_SAFE_INTEGER

interface BestTimeProps {
  sector2Colour: string
  previousBestFinishTime: number
  sector1Colour: string
  sector3Colour: string
  finishColour: string
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

export interface ClassBestSectorTimes {
  bestSector1: number
  bestSector2: number
  bestSector3: number

  previousBestSector1: number
  previousBestSector2: number
  previousBestSector3: number
}

export function getClassBestSectorTimes(
  classIndex: number,
  allRuns: CompetitorList
): ClassBestSectorTimes | null {
  const classInfo = allRuns.filter(
    (compeditor) => compeditor.classIndex === classIndex
  )

  if (typeof classInfo === 'undefined') return null

  const runs = classInfo.flatMap((compeditor) => compeditor.times)

  let bestSector1 = REALLY_LARGE_NUMBER
  let bestSector2 = REALLY_LARGE_NUMBER
  let bestSector3 = REALLY_LARGE_NUMBER

  let previousBestSector1 = REALLY_LARGE_NUMBER
  let previousBestSector2 = REALLY_LARGE_NUMBER
  let previousBestSector3 = REALLY_LARGE_NUMBER

  for (const run of runs) {
    if (typeof run == 'undefined' || run.status != 0) continue

    const sector1Time = run.split1
    const sector2Time = run.split2 - run.split1
    const sector3Time = run.time - run.split2

    if (sector1Time > 0 && sector1Time < bestSector1) {
      previousBestSector1 = bestSector1
      bestSector1 = sector1Time
    }

    if (sector2Time > 0 && sector2Time < bestSector2) {
      previousBestSector2 = bestSector2
      bestSector2 = sector2Time
    }

    if (sector3Time > 0 && sector3Time < bestSector3) {
      previousBestSector3 = bestSector3
      bestSector3 = sector3Time
    }
  }

  return {
    bestSector1,
    bestSector2,
    bestSector3,

    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
  }
}

export interface PersonalBestTotal {
  previousPersonalBestFinishTime: number
  personalBestFinishTime: number
}

export function getPersonalBestTotal(
  compeditor: Competitor
): PersonalBestTotal {
  let personalBestFinishTime = REALLY_LARGE_NUMBER
  let previousPersonalBestFinishTime = REALLY_LARGE_NUMBER

  for (const run of compeditor.times) {
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

export interface PersonalBestSector {
  previousPersonalBestSector1: number
  previousPersonalBestSector2: number
  previousPersonalBestSector3: number

  personalBestSector1: number
  personalBestSector2: number
  personalBestSector3: number
}

export function getPersonalBestSector(
  compeditor: Competitor
): PersonalBestSector {
  let personalBestSector1 = REALLY_LARGE_NUMBER
  let personalBestSector2 = REALLY_LARGE_NUMBER
  let personalBestSector3 = REALLY_LARGE_NUMBER

  let previousPersonalBestSector1 = REALLY_LARGE_NUMBER
  let previousPersonalBestSector2 = REALLY_LARGE_NUMBER
  let previousPersonalBestSector3 = REALLY_LARGE_NUMBER

  for (const run of compeditor.times) {
    if (typeof run == 'undefined' || run.status != 0) continue

    const sector1Time = run.split1
    const sector2Time = run.split2 - run.split1
    const sector3Time = run.time - run.split2

    if (sector1Time > 0 && sector1Time < personalBestSector1) {
      previousPersonalBestSector1 = personalBestSector1
      personalBestSector1 = sector1Time
    }

    if (sector2Time > 0 && sector2Time < personalBestSector2) {
      previousPersonalBestSector2 = personalBestSector2
      personalBestSector2 = sector2Time
    }

    if (sector3Time > 0 && sector3Time < personalBestSector3) {
      previousPersonalBestSector3 = personalBestSector3
      personalBestSector3 = sector3Time
    }
  }

  return {
    previousPersonalBestSector1,
    previousPersonalBestSector2,
    previousPersonalBestSector3,

    personalBestSector1,
    personalBestSector2,
    personalBestSector3,
  }
}

// eslint-disable-next-line complexity
export function RankTimes(
  currentRun: Competitor,
  allRuns: CompetitorList
): BestTimeProps {
  let split1 = 0.0
  let split2 = 0.0
  let time = 0.0
  let sector1Colour = 'background.default'
  let sector2Colour = 'background.default'
  let sector3Colour = 'background.default'
  let finishColour = 'background.default'

  const defaultBest = 9999999

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

  if (split1 <= bestSector1 && split1 > 0) {
    sector1Colour = 'purple'
  } else if (split1 <= personalBestSector1 && split1 > 0) {
    sector1Colour = 'green'
  } else if (split1 > 0) {
    sector1Colour = 'yellow'
  }

  if (split2 - split1 <= bestSector2 && split2 > 0) {
    sector2Colour = 'purple'
  } else if (split2 - split1 <= personalBestSector2 && split2 > 0) {
    sector2Colour = 'green'
  } else if (split2 > 0) {
    sector2Colour = 'yellow'
  }

  if (time - split2 <= bestSector3 && time > 0) {
    sector3Colour = 'purple'
  } else if (time - split2 <= personalBestSector3 && time > 0) {
    sector3Colour = 'green'
  } else if (time > 0) {
    sector3Colour = 'yellow'
  }

  if (time <= bestFinishTime && time > 0) {
    finishColour = 'purple'
  } else if (time <= personalBestFinishTime && time > 0) {
    finishColour = 'green'
  } else if (time > 0) {
    finishColour = 'yellow'
  }

  return {
    sector1Colour,
    sector2Colour,
    sector3Colour,
    finishColour,
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

export function TimeDeltas(
  times: TimeInfoManditory,
  personalBestSector1: number,
  previousPersonalBestSector1: number,
  bestSector1: number,
  previousBestSector1: number,
  personalBestSector2: number,
  previousPersonalBestSector2: number,
  bestSector2: number,
  previousBestSector2: number,
  personalBestSector3: number,
  previousPersonalBestSector3: number,
  bestSector3: number,
  previousBestSector3: number,
  personalBestFinishTime: number,
  previousPersonalBestFinishTime: number,
  bestFinishTime: number,
  previousBestFinishTime: number
) {
  let sector1DeltaPB = 0
  let sector1DeltaLeader = 0
  let sector2DeltaPB = 0
  let sector2DeltaLeader = 0
  let sector3DeltaPB = 0
  let sector3DeltaLeader = 0
  let finishDeltaPB = 0
  let finishDeltaLeader = 0

  const sector1 = times.split1
  const sector2 = times.split2 - times.split1
  const sector3 = times.time - times.split2
  const finishTime = times.time

  if (times.split1 > 0) {
    if (sector1 === personalBestSector1) {
      sector1DeltaPB = sector1 - previousPersonalBestSector1
    } else {
      sector1DeltaPB = sector1 - personalBestSector1
    }
    if (sector1 === bestSector1) {
      sector1DeltaLeader = sector1 - previousBestSector1
    } else {
      sector1DeltaLeader = sector1 - bestSector1
    }
  }
  if (times.split2 > 0) {
    if (sector2 === personalBestSector2) {
      sector2DeltaPB = sector2 - previousPersonalBestSector2
    } else {
      sector2DeltaPB = sector2 - personalBestSector2
    }
    if (sector2 === bestSector2) {
      sector2DeltaLeader = sector2 - previousBestSector2
    } else {
      sector2DeltaLeader = sector2 - bestSector2
    }
  }
  if (times.time > 0) {
    if (sector3 === personalBestSector3) {
      sector3DeltaPB = sector3 - previousPersonalBestSector3
    } else {
      sector3DeltaPB = sector3 - personalBestSector3
    }
    if (sector3 === bestSector3) {
      sector3DeltaLeader = sector3 - previousBestSector3
    } else {
      sector3DeltaLeader = sector3 - bestSector3
    }
    if (finishTime === personalBestFinishTime) {
      finishDeltaPB = finishTime - previousPersonalBestFinishTime
    } else {
      finishDeltaPB = finishTime - personalBestFinishTime
    }
    if (finishTime === bestFinishTime) {
      finishDeltaLeader = finishTime - previousBestFinishTime
    } else {
      finishDeltaLeader = finishTime - bestFinishTime
    }
  }
  return {
    sector1,
    sector2,
    sector3,
    finishTime,
    sector1DeltaPB,
    sector1DeltaLeader,
    sector2DeltaPB,
    sector2DeltaLeader,
    sector3DeltaPB,
    sector3DeltaLeader,
    finishDeltaPB,
    finishDeltaLeader,
  }
}
