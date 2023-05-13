import { Box, Container, Grid, Typography } from '@mui/material'
import CarCrash from '@mui/icons-material/CarCrash'
import React, { useEffect } from 'react'

import { trpc } from '../App'

import { requestWrapper } from '../components/requestWrapper'
import { calculateTimes, RankTimes } from 'ui-shared'
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
  const currentCompetitor = trpc.useQuery(['currentcompetitor.number'])
  const allRuns = trpc.useQuery(['competitors.list'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      currentCompetitor.refetch()
      allRuns.refetch()
    }, 1000 * 2)
  }, [currentCompetitor, allRuns])

  const requestErrors = requestWrapper({ currentCompetitor, allRuns })
  if (requestErrors) return requestErrors
  if (!currentCompetitor.data || !allRuns.data) {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy

  const currentRunArray = allRuns.data.filter(
    (a) => a.number === currentCompetitor.data
  )
  const currentRun = currentRunArray[0]

  const { sector1Colour, sector2Colour, sector3Colour, finishColour } =
    RankTimes(currentRun, allRuns.data)

  const idx = currentRun.times.length - 1
  const times = currentRun.times[idx]

  if (typeof times === 'undefined') return null

  const { sector1, sector2, sector3 } = calculateTimes(times)

  const finishColor = [sector1Colour, sector2Colour, sector3Colour].reduce(
    (accum, current) => (current !== 'background.default' ? current : accum),
    finishColour
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
              <RenderTime times={calculateTimes(times)} time={times} />
            </Box>
          </Grid>
        </Grid>
      </Typography>
    </Container>
  )
}
