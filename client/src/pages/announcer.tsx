import React, { useEffect } from 'react'
import { Timer } from '@mui/icons-material'
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
import { ResultsTable } from '../shared/components/table'
import { requestWrapper } from '../components/requestWrapper'
import { RankTimes, TimeDeltas } from '../shared/logic/functions'

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

const PrimaryPaperCenter = styled(Paper)(({ theme }) => ({
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

  const classes: { classIndex: number; class: string }[] = []
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
  const {
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
  } = RankTimes(currentRun, allRuns.data)

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
            (a, b) =>
              Math.min(...a.times.map((time) => time?.time || 10000000)) -
              Math.min(...b.times.map((time) => time?.time || 10000000))
          )}
          keyKey={'number'}
          runCount={runCount.data as number}
        />
      </Box>
    ))
  }

  const renderInfos = () => {
    const idx = currentRun.times.length - 1
    const times = currentRun.times[idx]

    if (typeof times !== 'undefined') {
      const {
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
                      ? (sector1 / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell>
                  {sector1 !== 0 &&
                  personalBestSector1 !== defaultBest &&
                  personalBestSector1 - defaultBest !== sector1DeltaPB
                    ? sector1DeltaPB > 0
                      ? '+' + (sector1DeltaPB / 1000).toFixed(2)
                      : (sector1DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector1 !== 0 &&
                  bestSector1 !== defaultBest &&
                  bestSector1 - defaultBest !== sector1DeltaLeader
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
                  {sector2 > 0
                    ? sector2 > 0
                      ? (sector2 / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell>
                  {sector2 > 0 &&
                  personalBestSector2 !== defaultBest &&
                  personalBestSector2 - defaultBest !== sector2DeltaPB
                    ? sector2DeltaPB > 0
                      ? '+' + (sector2DeltaPB / 1000).toFixed(2)
                      : (sector2DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector2 > 0 &&
                  bestSector2 !== defaultBest &&
                  bestSector2 - defaultBest !== sector2DeltaLeader
                    ? sector2DeltaLeader > 0
                      ? '+' + (sector2DeltaLeader / 1000).toFixed(2)
                      : (sector2DeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sector 3</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: sector3Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {sector3 > 0
                    ? sector3 > 0
                      ? (sector3 / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell>
                  {sector3 > 0 &&
                  sector3DeltaPB !== 0 &&
                  personalBestSector3 !== defaultBest &&
                  personalBestSector3 - defaultBest !== sector3DeltaPB
                    ? sector3DeltaPB > 0
                      ? '+' + (sector3DeltaPB / 1000).toFixed(2)
                      : (sector3DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {sector3 > 0 &&
                  sector3DeltaLeader !== 0 &&
                  bestSector3 !== defaultBest &&
                  bestSector3 - defaultBest !== sector3DeltaLeader
                    ? sector3DeltaLeader > 0
                      ? '+' + (sector3DeltaLeader / 1000).toFixed(2)
                      : (sector3DeltaLeader / 1000).toFixed(2)
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
                  {finishTime > 0
                    ? finishTime > 0
                      ? (finishTime / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell>
                  {finishTime > 0 &&
                  finishDeltaPB !== 0 &&
                  personalBestFinishTime !== defaultBest &&
                  personalBestFinishTime - defaultBest !== finishDeltaPB
                    ? finishDeltaPB > 0
                      ? '+' + (finishDeltaPB / 1000).toFixed(2)
                      : (finishDeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell>
                  {finishTime > 0 &&
                  finishDeltaLeader !== 0 &&
                  bestFinishTime !== defaultBest &&
                  bestFinishTime - defaultBest !== finishDeltaLeader
                    ? finishDeltaLeader > 0
                      ? '+' + (finishDeltaLeader / 1000).toFixed(2)
                      : (finishDeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
            </TableBody>
          </MUITable>
          <p />
          <Grid>
            Fastest finish times for the day
            <br />
            {bestFinishTimeOfTheDayName !== ''
              ? 'Outright: ' +
                (bestFinishTimeOfTheDay / 1000).toFixed(2) +
                ' by ' +
                bestFinishTimeOfTheDayName +
                ' in the ' +
                bestFinishTimeOfTheDayCar
              : ''}
            <br />
            {bestFinishTimeOfTheDayLadyName !== ''
              ? 'Lady: ' +
                (bestFinishTimeOfTheDayLady / 1000).toFixed(2) +
                ' by ' +
                bestFinishTimeOfTheDayLadyName +
                ' in the ' +
                bestFinishTimeOfTheDayLadyCar
              : ''}
            <br />
            {bestFinishTimeOfTheDayJuniorName !== ''
              ? 'Junior: ' +
                (bestFinishTimeOfTheDayJunior / 1000).toFixed(2) +
                ' by ' +
                bestFinishTimeOfTheDayJuniorName +
                ' in the ' +
                bestFinishTimeOfTheDayJuniorCar
              : ''}
            <br />
          </Grid>
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
            <PrimaryPaper
              sx={{
                fontSize: 24,
                height: 96,
              }}
            >
              {currentRun.number}: {currentRun.firstName} {currentRun.lastName}
              {', '}
              {currentRun.vehicle}
              <br></br>
              {currentRun.class}
            </PrimaryPaper>
          </Grid>
          <Grid item xs={4}>
            <PrimaryPaperCenter
              sx={{
                fontSize: 48,
                fontWeight: 500,
                height: 96,
              }}
            >
              {currentRun.special}
            </PrimaryPaperCenter>
          </Grid>
          <Grid item xs={4}>
            {' '}
            <PrimaryPaperCenter
              sx={{
                fontSize: 48,
                fontWeight: 500,
                height: 96,
              }}
            >
              Run {currentRun.times.length}
            </PrimaryPaperCenter>
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
