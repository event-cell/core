import { Box, Container, Grid, Typography } from '@mui/material'

import { trpc } from '../App'

import { requestWrapper } from '../components/requestWrapper'
import { useEffect } from 'react'
import { CarCrash } from '@mui/icons-material'

let displayInterval: any

export const TrackDisplay = () => {
  const currentRun = trpc.useQuery(['currentcompetitor.currentRun'])
  const allRuns = trpc.useQuery(['competitors.list'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentRun.refetch()
      allRuns.refetch()
    }, 1000 * 5)
  }, [currentRun, allRuns])

  const requestErrors = requestWrapper(currentRun)
  if (requestErrors) return requestErrors
  if (
    !currentRun.data ||
    !allRuns.data ||
    typeof currentRun.data.times === 'undefined'
  ) {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy

  let split1 = 0.0
  let split2 = 0.0
  let time = 0.0
  let split1Colour = 'background.default'
  let split2Colour = 'background.default'
  let timeColour = 'background.default'
  let split1txtColour = 'background.default'
  let split2txtColour = 'background.default'
  let timetxtColour = 'background.default'

  let bestSplit1 = 999999.0
  let bestSplit2 = 999999.0
  let bestTime = 999999.0
  let personalBestSplit1 = 999999.0
  let personalBestSplit2 = 999999.0
  let personalBestTime = 999999.0

  // Best split1 of the day

  for (const run of currentRun.data.times) {
    if (typeof run !== 'undefined') {
      split1 = run.split1
      split2 = run.split2
      time = run.time
      if (run.split1 < personalBestSplit1) {
        personalBestSplit1 = run.split1
      }
      if (run.split2 < personalBestSplit2) {
        personalBestSplit2 = run.split2
      }
      if (run.time < personalBestTime) {
        personalBestTime = run.time
      }
    }
  }

  for (const person of allRuns.data) {
    if (person.classIndex === currentRun.data.classIndex) {
      for (const run of person.times) {
        if (typeof run !== 'undefined') {
          if (run.split1 < bestSplit1) {
            bestSplit1 = run.split1
          }
          if (run.split2 < bestSplit2) {
            bestSplit2 = run.split2
          }
          if (run.time < bestTime) {
            bestTime = run.time
          }
        }
      }
    }
  }

  if (split1 <= bestSplit1 && split1 !== 0) {
    split1Colour = 'purple'
    split1txtColour = 'default'
  } else if (split1 <= personalBestSplit1 && split1 !== 0) {
    split1Colour = 'green'
    split1txtColour = 'default'
  } else if (split1 !== 0) {
    split1Colour = 'yellow'
    split1txtColour = 'default'
  }

  if (split2 <= bestSplit2 && split2 > 0) {
    split2Colour = 'purple'
    split2txtColour = 'default'
  } else if (split2 <= personalBestSplit2 && split2 > 0) {
    split2Colour = 'green'
    split2txtColour = 'default'
  } else if (split2 > 0) {
    split2Colour = 'yellow'
    split2txtColour = 'default'
  }

  if (time <= bestTime && time > 0) {
    timeColour = 'purple'
    timetxtColour = 'default'
  } else if (time <= personalBestTime && time > 0) {
    timeColour = 'green'
    timetxtColour = 'default'
  } else if (time > 0) {
    timeColour = 'yellow'
    timetxtColour = 'default'
  }

  // console.log(split1, split2, time)
  // console.log(personalBestSplit1, personalBestSplit2, personalBestTime)
  // console.log(bestSplit1, bestSplit2, bestTime)

  // fix decimals
  split1 = split1 / 1000
  split2 = split2 / 1000
  time = time / 1000

  // Render functions
  const renderTime = () => {
    const idx = currentRun.data.times.length - 1
    const times = currentRun.data.times[idx]

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

  return (
    <Container maxWidth={false}>
      <Typography>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }}
        >
          <Grid item xs={6}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={split1Colour}
            />
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={split2Colour}
            />
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                fontSize: 144,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                color: split1txtColour,
              }}
            >
              {split1.toFixed(2)}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                fontSize: 144,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                color: split2txtColour,
              }}
            >
              {split2.toFixed(2)}
            </Box>{' '}
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={timeColour}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                fontSize: 200,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                color: timetxtColour,
              }}
            >
              {renderTime()}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                fontSize: 72,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'left',
                bgcolor: 'background.default',
              }}
            >
              {currentRun.data.number}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                fontSize: 72,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'right',
                bgcolor: 'background.default',
              }}
            >
              {currentRun.data.lastName} {currentRun.data.firstName}
            </Box>
          </Grid>
        </Grid>
      </Typography>
    </Container>
  )
}
