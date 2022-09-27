import {
  Competitor,
  CompetitorList,
  TimeInfoManditory,
} from 'server/src/router/objects'

interface BestTimeProps {
  previousPersonalBestSector3: number
  previousPersonalBestSector2: number
  personalBestSector3: number
  bestSector1: number
  sector2Colour: string
  previousBestFinishTime: number
  previousPersonalBestFinishTime: number
  previousBestSector2: number
  personalBestFinishTime: number
  previousBestSector3: number
  previousPersonalBestSector1: number
  previousBestSector1: number
  sector1Colour: string
  personalBestSector2: number
  sector3Colour: string
  personalBestSector1: number
  bestSector2: number
  finishColour: string
  bestSector3: number
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
  let previousBestSector1 = defaultBest
  let bestSector2 = defaultBest
  let previousBestSector2 = defaultBest
  let bestSector3 = defaultBest
  let previousBestSector3 = defaultBest
  let bestFinishTime = defaultBest
  let previousBestFinishTime = defaultBest
  let personalBestSector1 = defaultBest
  let previousPersonalBestSector1 = defaultBest
  let personalBestSector2 = defaultBest
  let previousPersonalBestSector2 = defaultBest
  let personalBestSector3 = defaultBest
  let previousPersonalBestSector3 = defaultBest
  let personalBestFinishTime = defaultBest
  let previousPersonalBestFinishTime = defaultBest
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
        previousPersonalBestSector1 = personalBestSector1
        personalBestSector1 = run.split1
      }
      if (run.split2 - run.split1 < personalBestSector2 && run.split2 > 0) {
        previousPersonalBestSector2 = personalBestSector2
        personalBestSector2 = run.split2 - run.split1
      }
      if (run.time - run.split2 < personalBestSector3 && run.time > 0) {
        previousPersonalBestSector3 = personalBestSector3
        personalBestSector3 = run.time - run.split2
      }
      if (run.time < personalBestFinishTime && run.time > 0) {
        previousPersonalBestFinishTime = personalBestFinishTime
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
            previousBestSector1 = bestSector1
            bestSector1 = run.split1
          }
          if (run.split2 - run.split1 < bestSector2) {
            previousBestSector2 = bestSector2
            bestSector2 = run.split2 - run.split1
          }
          if (run.time - run.split2 < bestSector3) {
            previousBestSector3 = bestSector3
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

  if (finishColour === 'background.default') {
    if (sector2Colour === 'background.default') {
      finishColour = sector1Colour
    } else {
      finishColour = sector2Colour
    }
  }

  return {
    sector1Colour,
    sector2Colour,
    sector3Colour,
    finishColour,
    bestSector1,
    previousBestSector1,
    bestSector2,
    previousBestSector2,
    bestSector3,
    previousBestSector3,
    bestFinishTime,
    previousBestFinishTime,
    personalBestSector1,
    previousPersonalBestSector1,
    personalBestSector2,
    previousPersonalBestSector2,
    personalBestSector3,
    previousPersonalBestSector3,
    personalBestFinishTime,
    previousPersonalBestFinishTime,
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
