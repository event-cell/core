import { Box, Container, Grid, Typography } from '@mui/material'
import { CarCrash } from '@mui/icons-material'
import React, { useEffect } from 'react'

import { trpc } from '../App'

import { requestWrapper } from '../components/requestWrapper'
import {
  getClassBestSectorTimes,
  getPersonalBestSector,
  getPersonalBestTotal,
  RankTimes,
  TimeDeltas,
} from 'ui-shared'

let displayInterval: NodeJS.Timeout

export const TrackDisplay = () => {
  const currentCompetitor = trpc.useQuery(['currentcompetitor.number'])
  const allRuns = trpc.useQuery(['competitors.list'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentCompetitor.refetch()
      allRuns.refetch()
    }, 1000 * 2)
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

  const {
    sector1Colour,
    sector2Colour,
    sector3Colour,
    finishColour,
    bestFinishTime,
    previousBestFinishTime,
  } = RankTimes(currentRun, allRuns.data)

  const { previousPersonalBestFinishTime, personalBestFinishTime } =
    getPersonalBestTotal(currentRun)

  const {
    personalBestSector1,
    personalBestSector2,
    personalBestSector3,
    previousPersonalBestSector1,
    previousPersonalBestSector2,
    previousPersonalBestSector3,
  } = getPersonalBestSector(currentRun)

  const {
    bestSector1,
    bestSector2,
    bestSector3,
    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
  } = getClassBestSectorTimes(currentRun.classIndex, allRuns.data) || {
    bestSector1: 0,
    bestSector2: 0,
    bestSector3: 0,
    previousBestSector1: 0,
    previousBestSector2: 0,
    previousBestSector3: 0,
  }

  const idx = currentRun.times.length - 1
  const times = currentRun.times[idx]

  if (typeof times === 'undefined') return null

  const {
    sector1,
    sector2,
    sector3,
    finishTime,
    // Why are we just ignoring eslint's warnings if these variables are unused?
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector1DeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector1DeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector2DeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector2DeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector3DeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sector3DeltaLeader,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    finishDeltaPB,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    finishDeltaLeader,
  } = TimeDeltas(
    times,
    personalBestSector1,
    previousPersonalBestSector1,
    bestSector1,
    previousBestSector1,
    personalBestSector2,
    previousPersonalBestSector2,
    bestSector2,
    previousBestSector2,
    personalBestSector3,
    previousPersonalBestSector3,
    bestSector3,
    previousBestSector3,
    personalBestFinishTime,
    previousPersonalBestFinishTime,
    bestFinishTime,
    previousBestFinishTime
  )

  let finalFinishColour: string
  if (
    sector1Colour !== 'background.default' &&
    sector2Colour === 'background.default' &&
    sector3Colour === 'background.default'
  ) {
    finalFinishColour = sector1Colour
  } else if (
    sector1Colour !== 'background.default' &&
    sector2Colour !== 'background.default' &&
    sector3Colour === 'background.default'
  ) {
    finalFinishColour = sector2Colour
  } else {
    finalFinishColour = finishColour
  }

  // Render functions
  const renderTime = () => {
    const idx = currentRun.times.length - 1
    const times = currentRun.times[idx]

    if (typeof times !== 'undefined') {
      if (times.status === 2) {
        return (
          <Grid sx={{ color: 'white' }}>
            <CarCrash color="error" />
            DNF
          </Grid>
        )
      } else if (times.status === 3) {
        return (
          <Grid sx={{ color: 'white' }}>
            <CarCrash color="error" />
            DSQ
          </Grid>
        )
      } else if (
        finishTime <= 0 &&
        sector3 <= 0 &&
        sector2 <= 0 &&
        sector1 > 0
      ) {
        return (sector1 / 1000).toFixed(2)
      } else if (
        finishTime <= 0 &&
        sector3 <= 0 &&
        sector2 > 0 &&
        sector1 > 0
      ) {
        return (sector2 / 1000).toFixed(2)
      } else if (finishTime > 0 && sector3 > 0 && sector2 > 0 && sector1 > 0) {
        return (finishTime / 1000).toFixed(2)
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
              sx={{ height: 48, borderRadius: '4px', display: 'block' }}
              bgcolor={sector3Colour}
            />
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                fontSize: 130,
                fontWeight: '700',
                fontFamily: 'Roboto',
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
                fontSize: 130,
                fontWeight: '700',
                fontFamily: 'Roboto',
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
          <Grid item xs={4}>
            <Box
              sx={{
                fontSize: 130,
                fontWeight: '700',
                fontFamily: 'Roboto',
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
                bgcolor: 'background.default',
                height: 200,
              }}
            >
              {sector3 !== 0
                ? sector3 > 0
                  ? (sector3 / 1000).toFixed(2)
                  : ''
                : ''}{' '}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ height: 72, borderRadius: '4px', display: 'block' }}
              bgcolor={finalFinishColour}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                fontSize: 320,
                fontWeight: '700',
                fontFamily: 'Roboto',
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
        </Grid>
      </Typography>
    </Container>
  )
}
