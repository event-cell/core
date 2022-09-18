import {
  Competitor,
  CompetitorList,
  TimeInfoManditory,
} from 'server/src/router/objects'

interface BestTimeProps {
  previousPersonalBestSector2: number
  previousPersonalBestSector1: number
  personalBestSector2: number
  bestLaunch: number
  sector1Colour: string
  previousBestFinishTime: number
  previousPersonalBestFinishTime: number
  previousBestSector1: number
  personalBestFinishTime: number
  previousBestSector2: number
  previousPersonalBestLaunch: number
  previousBestLaunch: number
  launchColour: string
  personalBestSector1: number
  sector2Colour: string
  personalBestLaunch: number
  bestSector1: number
  finishColour: string
  bestSector2: number
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
  let launchColour = 'background.default'
  let sector1Colour = 'background.default'
  let sector2Colour = 'background.default'
  let finishColour = 'background.default'

  let defaultBest = 9999999

  let bestLaunch = defaultBest
  let previousBestLaunch = defaultBest
  let bestSector1 = defaultBest
  let previousBestSector1 = defaultBest
  let bestSector2 = defaultBest
  let previousBestSector2 = defaultBest
  let bestFinishTime = defaultBest
  let previousBestFinishTime = defaultBest
  let personalBestLaunch = defaultBest
  let previousPersonalBestLaunch = defaultBest
  let personalBestSector1 = defaultBest
  let previousPersonalBestSector1 = defaultBest
  let personalBestSector2 = defaultBest
  let previousPersonalBestSector2 = defaultBest
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
      if (run.split1 < personalBestLaunch && run.split1 > 0) {
        previousPersonalBestLaunch = personalBestLaunch
        personalBestLaunch = run.split1
      }
      if (run.split2 - run.split1 < personalBestSector1 && run.split2 > 0) {
        previousPersonalBestSector1 = personalBestSector1
        personalBestSector1 = run.split2 - run.split1
      }
      if (run.time - run.split2 < personalBestSector2 && run.time > 0) {
        previousPersonalBestSector2 = personalBestSector2
        personalBestSector2 = run.time - run.split2
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
          if (run.split1 < bestLaunch) {
            previousBestLaunch = bestLaunch
            bestLaunch = run.split1
          }
          if (run.split2 - run.split1 < bestSector1) {
            previousBestSector1 = bestSector1
            bestSector1 = run.split2 - run.split1
          }
          if (run.time - run.split2 < bestSector2) {
            previousBestSector2 = bestSector2
            bestSector2 = run.time - run.split2
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
          bestFinishTimeOfTheDayName = person.lastName + ' ' + person.firstName
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
              person.lastName + ' ' + person.firstName
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
              person.lastName + ' ' + person.firstName
            bestFinishTimeOfTheDayJuniorCar = person.vehicle
          }
        }
      }
    }
  }

  if (split1 <= bestLaunch && split1 > 0) {
    launchColour = 'purple'
  } else if (split1 <= personalBestLaunch && split1 > 0) {
    launchColour = 'green'
  } else if (split1 > 0) {
    launchColour = 'yellow'
  }

  if (split2 - split1 <= bestSector1 && split2 > 0) {
    sector1Colour = 'purple'
  } else if (split2 - split1 <= personalBestSector1 && split2 > 0) {
    sector1Colour = 'green'
  } else if (split2 > 0) {
    sector1Colour = 'yellow'
  }

  if (time - split2 <= bestSector2 && time > 0) {
    sector2Colour = 'purple'
  } else if (time - split2 <= personalBestSector2 && time > 0) {
    sector2Colour = 'green'
  } else if (time > 0) {
    sector2Colour = 'yellow'
  }

  if (time <= bestFinishTime && time > 0) {
    finishColour = 'purple'
  } else if (time <= personalBestFinishTime && time > 0) {
    finishColour = 'green'
  } else if (time > 0) {
    finishColour = 'yellow'
  }
  return {
    launchColour,
    sector1Colour,
    sector2Colour,
    finishColour,
    bestLaunch,
    previousBestLaunch,
    bestSector1,
    previousBestSector1,
    bestSector2,
    previousBestSector2,
    bestFinishTime,
    previousBestFinishTime,
    personalBestLaunch,
    previousPersonalBestLaunch,
    personalBestSector1,
    previousPersonalBestSector1,
    personalBestSector2,
    previousPersonalBestSector2,
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
  personalBestLaunch: number,
  previousPersonalBestLaunch: number,
  bestLaunch: number,
  previousBestLaunch: number,
  personalBestSector1: number,
  previousPersonalBestSector1: number,
  bestSector1: number,
  previousBestSector1: number,
  personalBestSector2: number,
  previousPersonalBestSector2: number,
  bestSector2: number,
  previousBestSector2: number,
  personalBestFinishTime: number,
  previousPersonalBestFinishTime: number,
  bestFinishTime: number,
  previousBestFinishTime: number
) {
  let launchDeltaPB: number = 0
  let launchDeltaLeader: number = 0
  let sector1DeltaPB: number = 0
  let sector1DeltaLeader: number = 0
  let sector2DeltaPB: number = 0
  let sector2DeltaLeader: number = 0
  let finishDeltaPB: number = 0
  let finishDeltaLeader: number = 0

  let launch = times.split1
  let sector1 = times.split2 - times.split1
  let sector2 = times.time - times.split2
  let finishTime = times.time

  if (times.split1 > 0) {
    if (launch === personalBestLaunch) {
      launchDeltaPB = launch - previousPersonalBestLaunch
    } else {
      launchDeltaPB = launch - personalBestLaunch
    }
    if (launch === bestLaunch) {
      launchDeltaLeader = launch - previousBestLaunch
    } else {
      launchDeltaLeader = launch - bestLaunch
    }
  }
  if (times.split2 > 0) {
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
  if (times.time > 0) {
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
    launch,
    sector1,
    sector2,
    finishTime,
    launchDeltaPB,
    launchDeltaLeader,
    sector1DeltaPB,
    sector1DeltaLeader,
    sector2DeltaPB,
    sector2DeltaLeader,
    finishDeltaPB,
    finishDeltaLeader,
  }
}
