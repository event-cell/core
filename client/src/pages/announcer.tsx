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
import { CarCrash, Timer } from '@mui/icons-material'
import { ResultsTable } from '../components/table'
import { useEffect } from 'react'
import { requestWrapper } from '../components/requestWrapper'

let displayInterval: any

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
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentCompetitor.refetch()
      allRuns.refetch()
      runCount.refetch()
    }, 1000 * 4)
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
  let split1Colour = 'background.default'
  let split2Colour = 'background.default'
  let timeColour = 'background.default'
  let split1txtColour = 'background.default'
  let split2txtColour = 'background.default'
  let timetxtColour = 'background.default'

  let bestLaunch = 9999999.0
  let bestSector1 = 9999999.0
  let bestSector2 = 9999999.0
  let bestFinishTime = 9999999.0
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
            bestLaunch = run.split1
          }
          if (run.split2 < bestSector1) {
            bestSector1 = run.split2
          }
          if (run.time < bestFinishTime) {
            bestFinishTime = run.time
          }
        }
      }
    }
  }

  if (split1 <= bestLaunch && split1 > 0) {
    split1Colour = 'purple'
    split1txtColour = 'default'
  } else if (split1 <= personalBestLaunch && split1 > 0) {
    split1Colour = 'green'
    split1txtColour = 'default'
  } else if (split1 > 0) {
    split1Colour = 'yellow'
    split1txtColour = 'default'
  }

  if (split2 <= bestSector1 && split2 > 0) {
    split2Colour = 'purple'
    split2txtColour = 'default'
  } else if (split2 <= personalBestSector1 && split2 > 0) {
    split2Colour = 'green'
    split2txtColour = 'default'
  } else if (split2 > 0) {
    split2Colour = 'yellow'
    split2txtColour = 'default'
  }

  if (time <= bestFinishTime && time > 0) {
    timeColour = 'purple'
    timetxtColour = 'default'
  } else if (time <= personalBestFinishTime && time > 0) {
    timeColour = 'green'
    timetxtColour = 'default'
  } else if (time > 0) {
    timeColour = 'yellow'
    timetxtColour = 'default'
  }

  // Render functions
  const renderTime = () => {
    const idx = currentRun.times.length - 1
    const times = currentRun.times[idx]

    if (typeof times !== 'undefined') {
      if (times.status === 2) {
        return (
          <Grid sx={{ color: 'white' }}>
            <CarCrash color="error" sx={{ fontSize: 200 }} />
            DNF
          </Grid>
        )
      } else if (times.status === 3) {
        return (
          <Grid sx={{ color: 'white' }}>
            <CarCrash color="error" sx={{ fontSize: 200 }} />
            DSQ
          </Grid>
        )
      } else {
        return time.toFixed(2)
      }
    }
  }

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
      let Launch
      let Sector1
      let Sector1Time
      let Finish
      let FinishTime
      let LaunchDeltaPB

      if (times.split1 > 0) {
        Launch = (times.split1 / 1000).toFixed(2)
        if ((times.split1 = personalBestLaunch)) {
          LaunchDeltaPB = (
            (previousPersonalBestLaunch - times.split1) /
            1000
          ).toFixed(2)
        } else {
          LaunchDeltaPB = ((personalBestLaunch - times.split1) / 1000).toFixed(
            2
          )
        }
      }

      if (times.split2 > 0) {
        Sector1Time = (times.split2 / 1000).toFixed(2)
        Sector1 = (times.split2 / 1000 - times.split1 / 1000).toFixed(2)
      }

      if (times.time > 0) {
        FinishTime = (times.time / 1000).toFixed(2)
        Finish = (times.time / 1000 - times.split2 / 1000).toFixed(2)
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
                      backgroundColor: split1Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>{Launch}</TableCell>
                <TableCell>{LaunchDeltaPB}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sector 1</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: split2Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>{Sector1}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sector 2</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: timeColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>{' '}
                <TableCell>{Finish}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Finish</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: timeColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>{FinishTime}</TableCell>
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
