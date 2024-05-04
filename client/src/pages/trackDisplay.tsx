import { Box, Container, Grid, Typography } from '@mui/material'
import CarCrash from '@mui/icons-material/CarCrash'
import React, { useEffect } from 'react'

import { trpc } from '../App'

import { requestWrapper } from '../components/requestWrapper'
import {
  calculateTimes,
  getGlobalBestSectors,
  getPersonalBestSectors,
  getSectorColors,
} from 'ui-shared'
import { TimeInfo } from 'server/src/router/objects'

let displayInterval: NodeJS.Timeout

function getLatestSector({
  finish,
  sector1,
  sector2,
  sector3,
}: {
  finish: number
  sector1: number
  sector2: number
  sector3: number
}): string {
  const formatNumber = (num: number) => (num / 1000).toFixed(2)

  if (finish > 0) return formatNumber(finish)
  if (sector3 > 0) return formatNumber(sector3)
  if (sector2 > 0) return formatNumber(sector2)
  if (sector1 > 0) return formatNumber(sector1)

  return ''
}

const RenderTime = ({
  times,
  time,
}: {
  times: {
    sector1: number
    sector2: number
    sector3: number
    finish: number
  }
  time: TimeInfo | undefined
}) => {
  if (typeof time === 'undefined') return null

  if (time.status === 2) {
    return (
      <Grid sx={{ color: 'white' }}>
        <CarCrash color="error" />
        DNF
      </Grid>
    )
  }

  if (time.status === 3) {
    return (
      <Grid sx={{ color: 'white' }}>
        <CarCrash color="error" />
        DSQ
      </Grid>
    )
  }

  return <>{getLatestSector(times)}</>
}

export const TrackDisplay = () => {
  const currentCompetitorId = trpc.useQuery(['currentcompetitor.number'])
  const competitors = trpc.useQuery(['competitors.list'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentCompetitorId.refetch()
      competitors.refetch()
    }, 1000 * 2)
  }, [currentCompetitorId, competitors])

  const requestErrors = requestWrapper({
    currentCompetitor: currentCompetitorId,
    allRuns: competitors,
  })
  if (requestErrors) return requestErrors
  if (!currentCompetitorId.data || !competitors.data) {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy

  const currentCompetitor = competitors.data.find(
    (a) => a.number === currentCompetitorId.data
  )!

  const idx = currentCompetitor.times.length - 1
  const splits = currentCompetitor.times[idx]!

  const globalBest = getGlobalBestSectors(competitors.data)
  const personalBest = getPersonalBestSectors(currentCompetitor)
  const times = calculateTimes(splits)
  const {
    first: sector1Colour,
    second: sector2Colour,
    third: sector3Colour,
    finish: finishPartial,
  } = getSectorColors(globalBest, personalBest, times)

  const { sector1, sector2, sector3 } = times

  const finishColor = [sector1Colour, sector2Colour, sector3Colour].reduce(
    (accum, current) => (current !== 'background.default' ? current : accum),
    finishPartial
  )

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
              bgcolor={finishColor}
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
              <RenderTime times={calculateTimes(splits)} time={splits} />
            </Box>
          </Grid>
        </Grid>
      </Typography>
    </Container>
  )
}
