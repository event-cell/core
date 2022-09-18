import { Box, Container, Grid, Typography } from '@mui/material'

import { trpc } from '../App'

import { requestWrapper } from '../components/requestWrapper'
import { useEffect } from 'react'
import { RankTimes, TimeDeltas } from '../components/functions'
import { CarCrash } from '@mui/icons-material'

let displayInterval: any

export const TrackDisplay = () => {
  const currentCompetitor = trpc.useQuery(['currentcompetitor.number'])
  const allRuns = trpc.useQuery(['competitors.list'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentCompetitor.refetch()
      allRuns.refetch()
    }, 1000 * 5)
  }, [currentCompetitor, allRuns])

  const requestErrors = requestWrapper(currentCompetitor, allRuns)
  if (requestErrors) return requestErrors
  if (!currentCompetitor.data || !allRuns.data) {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy

  const currentRunArray = allRuns.data.filter(
    (a) => a.number === currentCompetitor.data
  )
  const currentRun = currentRunArray[0]

  let {
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
  } = RankTimes(currentRun, allRuns.data)

  const idx = currentRun.times.length - 1
  const times = currentRun.times[idx]

  if (typeof times === 'undefined') return null

  let {
    launch,
    sector1,
    sector2,
    finishTime,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    launchDeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    launchDeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector1DeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector1DeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector2DeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector2DeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    finishDeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    finishDeltaLeader,
  } = TimeDeltas(
    times,
    personalBestLaunch,
    previousPersonalBestLaunch,
    bestLaunch,
    previousBestLaunch,
    personalBestSector1,
    previousPersonalBestSector1,
    bestSector1,
    previousBestSector1,
    personalBestSector2,
    previousPersonalBestSector2,
    bestSector2,
    previousBestSector2,
    personalBestFinishTime,
    previousPersonalBestFinishTime,
    bestFinishTime,
    previousBestFinishTime
  )

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
      } else if (finishTime !== 0) {
        if (finishTime > 0) {
          return (finishTime / 1000).toFixed(2)
        }
      } else {
        return ''
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
          <Grid item xs={4}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={launchColour}
            />
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={sector1Colour}
            />
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={sector2Colour}
            />
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                fontSize: 144,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                height: 200,
              }}
            >
              {launch !== 0
                ? launch > 0
                  ? (launch / 1000).toFixed(2)
                  : ''
                : ''}{' '}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                fontSize: 144,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                height: 200,
              }}
            >
              {sector1 !== 0
                ? sector1 > 0
                  ? (sector1 / 1000).toFixed(2)
                  : ''
                : ''}{' '}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                fontSize: 144,
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                height: 200,
              }}
            >
              {sector2 !== 0
                ? sector2 > 0
                  ? (sector2 / 1000).toFixed(2)
                  : ''
                : ''}{' '}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ height: 92, borderRadius: '4px', display: 'block' }}
              bgcolor={finishColour}
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
                height: 280,
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
              {currentRun.number}
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
              {currentRun.lastName} {currentRun.firstName}
            </Box>
          </Grid>
        </Grid>
      </Typography>
    </Container>
  )
}
