import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  styled,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { trpc } from '../App'
import { Timer } from '@mui/icons-material'
import { ResultsTable } from '../components/table'
import { useEffect } from 'react'
import { requestWrapper } from '../components/requestWrapper'

const SecondaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export const Announcer = () => {
  const currentCompetitor = trpc.useQuery(['currentcompetitor.number'])
  const allRuns = trpc.useQuery(['competitors.list'])
  const runCount = trpc.useQuery(['runs.count'])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await Promise.all([
        currentCompetitor.refetch(),
        allRuns.refetch(),
        runCount.refetch(),
      ])
    }, 1000 * 4)
    return () => clearTimeout(timeout)
  }, [currentCompetitor, allRuns, runCount])

  const requestErrors = requestWrapper(currentCompetitor, allRuns, runCount)
  if (requestErrors) return requestErrors

  if (!currentCompetitor.data || !allRuns.data || !runCount.data) {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy

  const currentRunArray = allRuns.data.filter(
    (a) => a.number === currentCompetitor.data
  )
  const currentRun = currentRunArray[0]

  // Sort classes in class order as per the index value
  // in the timing software

  let classes: { classIndex: number; class: string }[] = []
  let maxClassIndex = 0

  allRuns.data.forEach((a) => {
    if (a.classIndex > maxClassIndex) {
      maxClassIndex = a.classIndex
    }
  })

  for (let i = 1; i < maxClassIndex + 1; i++) {
    let shouldSkip = false
    allRuns.data.forEach((row) => {
      if (shouldSkip) {
        return
      }
      if (row.classIndex === i) {
        classes.push({ classIndex: row.classIndex, class: row.class })
        shouldSkip = true
      }
    })
  }

  const classesList = classes.map((carClass) => ({
    carClass,
    drivers: allRuns.data.filter(
      (data) => data.classIndex === carClass.classIndex
    ),
  }))

  const currentClassList = classesList.filter(
    (a) => a.carClass.classIndex === currentRun.classIndex
  )

  let split1 = 0.0
  let split2 = 0.0
  let time = 0.0
  let launchColour = 'background.default'
  let sector1Colour = 'background.default'
  let sector2Colour = 'background.default'
  let finishColour = 'background.default'

  let bestLaunch = 9999999.0
  let previousBestLaunch = 9999999.0
  let bestSector1 = 9999999.0
  let previousBestSector1 = 9999999.0
  let bestSector2 = 9999999.0
  let previousBestSector2 = 9999999.0
  let bestFinishTime = 9999999.0
  let previousBestFinishTime = 9999999.0
  let personalBestLaunch = 9999999.0
  let previousPersonalBestLaunch = 9999999.0
  let personalBestSector1 = 9999999.0
  let previousPersonalBestSector1 = 9999999.0
  let personalBestSector2 = 9999999.0
  let previousPersonalBestSector2 = 9999999.0
  let personalBestFinishTime = 9999999.0
  let previousPersonalBestFinishTime = 9999999.0

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
    }
  }

  for (const person of allRuns.data) {
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

  // Render functions
  const renderClassList = () => {
    return currentClassList.map((eventClass) => (
      <Box key={eventClass.carClass.class} textAlign="left">
        <Box fontWeight="fontWeightMedium" display="inline" lineHeight="3">
          {eventClass.carClass.class}&nbsp;&nbsp;&nbsp;&nbsp;
        </Box>
        <Chip
          label={'Class Record: ' + eventClass.drivers[0].classRecord}
          variant="outlined"
          color="info"
          size="medium"
          icon={<Timer />}
        />
        <ResultsTable
          data={eventClass.drivers.sort(
            (a: { times: any[] }, b: { times: any[] }) =>
              Math.min(...a.times.map((time) => time?.time || 10000000)) -
              Math.min(...b.times.map((time) => time?.time || 10000000))
          )}
          keyKey={'number'}
          runCount={runCount.data as number}
        />
      </Box>
    ))
  }

  const renderNextDriver = () => {
    return <SecondaryPaper>Next Driver</SecondaryPaper>
  }

  const renderPreviousDriver = () => {
    return <SecondaryPaper>Previous Driver</SecondaryPaper>
  }
  const renderInfos = () => {
    const idx = currentRun.times.length - 1
    const times = currentRun.times[idx]

    if (typeof times !== 'undefined') {
      let launch: number = 0
      let sector1: number = 0
      let sector2: number = 0
      let finish: number = 0
      let finishTime: number = 0
      let launchDeltaPB: number = 0
      let launchDeltaLeader: number = 0
      let sector1DeltaPB: number = 0
      let sector1DeltaLeader: number = 0
      let sector2DeltaPB: number = 0
      let sector2DeltaLeader: number = 0
      let finishDeltaPB: number = 0
      let finishDeltaLeader: number = 0

      if (times.split1 > 0) {
        launch = times.split1
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
        sector1 = times.split2 - times.split1
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
        finishTime = times.time
        sector2 = times.time - times.split2

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

      return (
        <PrimaryPaper>
          <MUITable sx={{ minWidth: 200 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell width={2}></TableCell>
                <TableCell width={1}></TableCell>
                <TableCell width={2}>Time</TableCell>
                <TableCell width={2}>&Delta; PB</TableCell>
                <TableCell width={2}>&Delta; #1</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Launch</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: launchColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {launch !== 0
                    ? launch > 0
                      ? '+' + (launch / 1000).toFixed(2)
                      : (launch / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {launchDeltaPB !== 0
                    ? launchDeltaPB > 0
                      ? '+' + (launchDeltaPB / 1000).toFixed(2)
                      : (launchDeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {launchDeltaLeader !== 0
                    ? launchDeltaLeader > 0
                      ? '+' + (launchDeltaLeader / 1000).toFixed(2)
                      : (launchDeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sector 1</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: sector1Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {sector1 !== 0
                    ? sector1 > 0
                      ? '+' + (sector1 / 1000).toFixed(2)
                      : (sector1 / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector1DeltaPB !== 0
                    ? sector1DeltaPB > 0
                      ? '+' + (sector1DeltaPB / 1000).toFixed(2)
                      : (sector1DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector1DeltaLeader !== 0
                    ? sector1DeltaLeader > 0
                      ? '+' + (sector1DeltaLeader / 1000).toFixed(2)
                      : (sector1DeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sector 2</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: sector2Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {sector2 !== 0
                    ? sector2 > 0
                      ? '+' + (sector2 / 1000).toFixed(2)
                      : (sector2 / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector2DeltaPB !== 0
                    ? sector2DeltaPB > 0
                      ? '+' + (sector2DeltaPB / 1000).toFixed(2)
                      : (sector2DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector2DeltaLeader !== 0
                    ? sector2DeltaLeader > 0
                      ? '+' + (sector2DeltaLeader / 1000).toFixed(2)
                      : (sector2DeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Finish Time</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: finishColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {finishTime !== 0
                    ? finishTime > 0
                      ? '+' + (finishTime / 1000).toFixed(2)
                      : (finishTime / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {finishDeltaPB !== 0
                    ? finishDeltaPB > 0
                      ? '+' + (finishDeltaPB / 1000).toFixed(2)
                      : (finishDeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {finishDeltaLeader !== 0
                    ? finishDeltaLeader > 0
                      ? '+' + (finishDeltaLeader / 1000).toFixed(2)
                      : (finishDeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
            </TableBody>
          </MUITable>
        </PrimaryPaper>
      )
    }
  }

  return (
    <Container maxWidth={false}>
      <Typography component={'span'}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }}
        >
          <Grid item xs={4}>
            {renderPreviousDriver()}
          </Grid>
          <Grid item xs={4}>
            <PrimaryPaper>
              {currentRun.lastName} {currentRun.firstName}
              <p />
              {currentRun.vehicle}
            </PrimaryPaper>
          </Grid>
          <Grid item xs={4}>
            {renderNextDriver()}
          </Grid>
          <Grid item xs={4}>
            {renderInfos()}
          </Grid>
          <Grid item xs={8}>
            <PrimaryPaper>{renderClassList()}</PrimaryPaper>
          </Grid>
        </Grid>
      </Typography>
    </Container>
  )
}
