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
import React, { FC, useMemo } from 'react'

import { ResultsTable } from './table'
import { Timer } from '@mui/icons-material'

import { RankTimes, TimeDeltas } from '../logic/functions'

import {
  Competitor,
  CompetitorList,
} from '../../../../server/src/router/objects'
import { DisplayHeader } from './display/header'

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

interface ClassType {
  drivers: CompetitorList
  carClass: { classIndex: number; class: string }
}

const getDisplayNumber = (): number => {
  if (
    typeof window === 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/')
  )
    return 0

  return Number(window.location.pathname.replace('/display/', ''))
}

/**
 * This is the internal logic of the {@link splitDisplay} function. It is here
 * to make it easier to test
 */
export const splitDisplayLogic = ({
  classesList,
  screenIndex,
  itemsPerScreen,
}: {
  classesList: ClassType[]
  screenIndex: number
  itemsPerScreen: number
}): ClassType[] =>
  classesList.filter(
    (_class, index) =>
      // If the class was not on the last screen
      index >= (screenIndex - 1) * itemsPerScreen &&
      // If the class is not large enough to be on the next screen
      index < screenIndex * itemsPerScreen
  )

function splitDisplay(classesList: ClassType[]) {
  // Calculate ClassesList for each screen.
  const numberOfScreens = 4 // TODO: This should be configurable
  const itemsPerScreen = Math.ceil(classesList.length / numberOfScreens)

  // If we are in a NextJS server-side render, window will not be present. We
  // also want to exit out early if this page is `/display` on the client or
  // does not include `/display/`
  if (
    typeof window == 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/')
  )
    return classesList

  try {
    const screenIndex = Number.parseInt(
      window.location.pathname.replace('/display/', '')
    )

    return splitDisplayLogic({ classesList, screenIndex, itemsPerScreen })
  } catch (e) {
    console.warn(
      'Failed to generate classList for this display. Falling back to the full list'
    )
    console.warn(e)

    return classesList
  }
}

export const Display: FC<{
  currentCompetitor: number
  allRuns: CompetitorList
  runCount: number
}> = ({ currentCompetitor, allRuns, runCount }) => {
  // Sort classes in class order as per the index value
  // in the timing software

  const classes: { classIndex: number; class: string }[] = []
  let maxClassIndex = 0

  allRuns.forEach((a) => {
    if (a.classIndex > maxClassIndex) {
      maxClassIndex = a.classIndex
    }
  })

  for (let i = 1; i < maxClassIndex + 1; i++) {
    let shouldSkip = false
    allRuns.forEach((row) => {
      if (shouldSkip) {
        return
      }
      if (row.classIndex === i) {
        classes.push({ classIndex: row.classIndex, class: row.class })
        shouldSkip = true
      }
    })
  }

  const printClassesList = useMemo(() => {
    const classesList = classes.map((carClass) => ({
      carClass,
      drivers: allRuns
        .filter((data) => data.classIndex === carClass.classIndex)
        .sort(
          (a, b) =>
            Math.min(...a.times.map((time) => time?.time || 10000000)) -
            Math.min(...b.times.map((time) => time?.time || 10000000))
        ),
    }))

    const displayContent = splitDisplay(classesList)

    if (!displayContent) return

    return displayContent
  }, [classes])

  if (!currentCompetitor || !runCount) {
    console.warn('Missing currentCompetitor or runCount data')
    return <div />
  } // This will never be called, but it is needed to make typescript happy

  const currentRunArray = allRuns.filter((a) => a.number === currentCompetitor)
  const currentRun = currentRunArray[0]

  const displayNumber = getDisplayNumber()

  if (printClassesList) {
    return (
      <Container>
        <DisplayHeader display={displayNumber} />

        {printClassesList.map((eventClass) => (
          <div key={eventClass.carClass.class}>
            <Typography component="div">
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: '1fr',
                }}
              >
                <Box
                  fontWeight="fontWeightMedium"
                  sx={{
                    gridColumn: '1 / 3',
                    m: 1,
                  }}
                >
                  {eventClass.carClass.class}
                </Box>
                <Box
                  sx={{
                    gridColumn: '3 / 4',
                    m: 1,
                  }}
                >
                  <Chip
                    label={'Class Record: ' + eventClass.drivers[0].classRecord}
                    variant="outlined"
                    color="info"
                    size="small"
                    icon={<Timer />}
                  />
                </Box>
              </Box>
            </Typography>
            <ResultsTable
              data={eventClass.drivers.sort(
                (a, b) =>
                  Math.min(...a.times.map((time) => time?.time || 10000000)) -
                  Math.min(...b.times.map((time) => time?.time || 10000000))
              )}
              runCount={runCount as number}
            />
          </div>
        ))}
        {displayNumber === 4 || displayNumber === 0 ? (
          <Grid>
            <Grid
              sx={{
                height: 6,
              }}
            ></Grid>
            <Grid
              sx={{
                fontSize: 24,
                height: 130,
              }}
            >
              <PrimaryPaper>
                ON TRACK
                <br />
                {currentRun.number}: {currentRun.firstName}{' '}
                {currentRun.lastName}
                {', '}
                {currentRun.vehicle}
                <br></br>
                {currentRun.class}
              </PrimaryPaper>
            </Grid>
            <Grid item xs={4}>
              <RenderInfo currentRun={currentRun} allRuns={allRuns} />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Container>
    )
  } else {
    return null
  }
}

export const DisplayCompetitorList: FC<{
  allRuns: CompetitorList
}> = ({ allRuns }) => {
  // Sort classes in class order as per the index value
  // in the timing software

  const classes: { classIndex: number; class: string }[] = []
  let maxClassIndex = 0

  allRuns.forEach((a) => {
    if (a.classIndex > maxClassIndex) {
      maxClassIndex = a.classIndex
    }
  })

  for (let i = 1; i < maxClassIndex + 1; i++) {
    let shouldSkip = false
    allRuns.forEach((row) => {
      if (shouldSkip) {
        return
      }
      if (row.classIndex === i) {
        classes.push({ classIndex: row.classIndex, class: row.class })
        shouldSkip = true
      }
    })
  }

  const printClassesList = useMemo(() => {
    const classesList = classes.map((carClass) => ({
      carClass,
      drivers: allRuns
        .filter((data) => data.classIndex === carClass.classIndex)
        .sort(
          (a, b) =>
            Math.min(...a.times.map((time) => time?.time || 10000000)) -
            Math.min(...b.times.map((time) => time?.time || 10000000))
        ),
    }))

    const displayContent = splitDisplay(classesList)

    if (!displayContent) return

    return displayContent
  }, [classes])

  const displayNumber = getDisplayNumber()
  const runCount = 1

  if (printClassesList) {
    return (
      <Container>
        <DisplayHeader display={displayNumber} />

        {printClassesList.map((eventClass) => (
          <div key={eventClass.carClass.class}>
            <Typography component="div">
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: '1fr',
                }}
              >
                <Box
                  fontWeight="fontWeightMedium"
                  sx={{
                    gridColumn: '1 / 3',
                    m: 1,
                  }}
                >
                  {eventClass.carClass.class}
                </Box>
                <Box
                  sx={{
                    gridColumn: '3 / 4',
                    m: 1,
                  }}
                >
                  <Chip
                    label={'Class Record: ' + eventClass.drivers[0].classRecord}
                    variant="outlined"
                    color="info"
                    size="small"
                    icon={<Timer />}
                  />
                </Box>
              </Box>
            </Typography>
            <ResultsTable
              data={eventClass.drivers.sort(
                (a, b) =>
                  Math.min(...a.times.map((time) => time?.time || 10000000)) -
                  Math.min(...b.times.map((time) => time?.time || 10000000))
              )}
              runCount={runCount as number}
            />
          </div>
        ))}
      </Container>
    )
  } else {
    return <div />
  }
}

const tableFontSizeMid = '1.2rem'
const tableFontSizeLarge = '1.4rem'
const blockSize = 30

function RenderSector({
  sectorName,
  time,
  deltaPB,
  deltaLeader,
  sectorPB,
  bestSector,
  sectorColor,
  defaultBest,
}: {
  sectorName: string
  time: number
  deltaPB: number
  deltaLeader: number
  sectorPB: number
  bestSector: number
  sectorColor: string
  defaultBest: number
}) {
  return (
    <TableRow>
      <TableCell sx={{ fontSize: tableFontSizeLarge }}>{sectorName}</TableCell>
      <TableCell>
        <Box
          sx={{
            width: blockSize,
            height: blockSize,
            backgroundColor: sectorColor,
            borderRadius: '4px',
          }}
        />
      </TableCell>
      <TableCell sx={{ fontSize: tableFontSizeLarge }}>
        {time > 0 ? (time > 0 ? (time / 1000).toFixed(2) : '') : ''}
      </TableCell>
      <TableCell sx={{ fontSize: tableFontSizeLarge }}>
        {time > 0 &&
        sectorPB !== defaultBest &&
        sectorPB - defaultBest !== deltaPB
          ? deltaPB > 0
            ? '+' + (deltaPB / 1000).toFixed(2)
            : (deltaPB / 1000).toFixed(2)
          : ''}
      </TableCell>
      <TableCell sx={{ fontSize: tableFontSizeLarge }}>
        {time > 0 &&
        bestSector !== defaultBest &&
        bestSector - defaultBest !== deltaLeader
          ? deltaLeader > 0
            ? '+' + (deltaLeader / 1000).toFixed(2)
            : (deltaLeader / 1000).toFixed(2)
          : ''}
      </TableCell>
    </TableRow>
  )
}

const RenderInfo: FC<{ currentRun: Competitor; allRuns: CompetitorList }> = ({
  currentRun,
  allRuns,
}) => {
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
  } = RankTimes(currentRun, allRuns)

  const idx = currentRun.times.length - 1
  const times = currentRun.times[idx]

  if (typeof times == 'undefined') return <div />

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
    <Grid>
      <Grid>
        <PrimaryPaper>
          <MUITable sx={{ minWidth: 200 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell width={2}></TableCell>
                <TableCell width={1}></TableCell>
                <TableCell width={2} sx={{ fontSize: tableFontSizeMid }}>
                  Time
                </TableCell>
                <TableCell width={2} sx={{ fontSize: tableFontSizeMid }}>
                  &Delta; PB today
                </TableCell>
                <TableCell width={2} sx={{ fontSize: tableFontSizeMid }}>
                  &Delta; #1 in class
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <RenderSector
                sectorName={'Sector 1'}
                time={sector1}
                deltaPB={sector1DeltaPB}
                deltaLeader={sector1DeltaLeader}
                sectorPB={personalBestSector1}
                bestSector={bestSector1}
                sectorColor={sector1Colour}
                defaultBest={defaultBest}
              />

              <RenderSector
                sectorName={'Sector 2'}
                time={sector2}
                deltaPB={sector2DeltaPB}
                deltaLeader={sector2DeltaLeader}
                sectorPB={personalBestSector2}
                bestSector={bestSector2}
                sectorColor={sector2Colour}
                defaultBest={defaultBest}
              />

              <RenderSector
                sectorName={'Sector 3'}
                time={sector3}
                deltaPB={sector3DeltaPB}
                deltaLeader={sector3DeltaLeader}
                sectorPB={personalBestSector3}
                bestSector={bestSector3}
                sectorColor={sector3Colour}
                defaultBest={defaultBest}
              />

              <RenderSector
                sectorName={'Finish'}
                time={finishTime}
                deltaPB={finishDeltaPB}
                deltaLeader={finishDeltaLeader}
                sectorPB={personalBestFinishTime}
                bestSector={bestFinishTime}
                sectorColor={finishColour}
                defaultBest={defaultBest}
              />
            </TableBody>
          </MUITable>
        </PrimaryPaper>
      </Grid>
      <Grid
        sx={{
          height: 6,
        }}
      ></Grid>
      <Grid>
        <PrimaryPaper>
          <Grid sx={{ fontSize: tableFontSizeLarge }}>
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
      </Grid>
    </Grid>
  )
}
