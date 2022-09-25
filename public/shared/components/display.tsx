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
import React, { FC } from 'react'

import { ResultsTable } from './table'
import { Timer } from '@mui/icons-material'

import { RankTimes, TimeDeltas } from '../logic/functions'

import Image2 from '../assets/image2.jpeg'
import { CompetitorList } from '../../../../server/src/router/objects'

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

interface ClassType {
  drivers: any
  carClass: { classIndex: number; class: string }
}

const getDisplayNumber = (): number => {
  if (
    typeof window === 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/')
  )
    return 0

  return Number(window.location.pathname.replace('/display/'))
}

function splitDisplay(classesList: ClassType[]) {
  // Calculate ClassesList for each screen
  // Max 20 elements per screen

  // If we are in a NextJS server-side render, window will not be present. We
  // also want to exit out early if this page is `/display` on the client or
  // does not include `/display/`
  if (
    typeof window == 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/')
  )
    return classesList

  let classesListScreen01: { carClass: any; drivers: any }[] = []
  let classesListScreen02: { carClass: any; drivers: any }[] = []
  let classesListScreen03: { carClass: any; drivers: any }[] = []
  let classesListScreen04: { carClass: any; drivers: any }[] = []

  let screenLength = 0
  const targetScreenLength = 24
  classesList.forEach((currentClass) => {
    screenLength = screenLength + Object.keys(currentClass.drivers).length + 1
    if (screenLength <= targetScreenLength) {
      classesListScreen01.push(currentClass)
    } else if (
      screenLength > targetScreenLength &&
      screenLength <= targetScreenLength * 2
    ) {
      classesListScreen02.push(currentClass)
    }
    if (
      screenLength > targetScreenLength * 2 &&
      screenLength <= targetScreenLength * 3
    ) {
      classesListScreen03.push(currentClass)
    } else if (screenLength > targetScreenLength * 4) {
      classesListScreen04.push(currentClass)
    }
  })

  if (window.location.pathname === '/display/1') {
    return classesListScreen01
  } else if (window.location.pathname === '/display/2') {
    return classesListScreen02
  } else if (window.location.pathname === '/display/3') {
    return classesListScreen03
  } else if (window.location.pathname === '/display/4') {
    return classesListScreen04
  }
}

export const Display: FC<{
  currentCompetitor: number
  allRuns: CompetitorList
  runCount: number
}> = ({ currentCompetitor, allRuns, runCount }) => {
  // Sort classes in class order as per the index value
  // in the timing software

  let classes: { classIndex: number; class: string }[] = []
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

  const classesList = classes.map((carClass) => ({
    carClass,
    drivers: allRuns.filter((data) => data.classIndex === carClass.classIndex),
  }))

  // If there are no runs, just print out competitors

  if (!currentCompetitor || !runCount) {
    console.warn('Missing currentCompetitor or runCount data')
    let printClassesList = splitDisplay(classesList)
    if (printClassesList) {
      return (
        <Container>
          {printClassesList.map((eventClass) => (
            <div key={eventClass.carClass.class}>
              <Typography component="div">
                <Box
                  fontWeight="fontWeightMedium"
                  display="inline"
                  lineHeight="2"
                >
                  {eventClass.carClass.class}&nbsp;&nbsp;&nbsp;&nbsp;
                </Box>
                <Chip
                  label={'Class Record: ' + eventClass.drivers[0].classRecord}
                  variant="outlined"
                  color="info"
                  size="small"
                  icon={<Timer />}
                />
              </Typography>
              <ResultsTable
                data={eventClass.drivers.sort(
                  (a: { times: any[] }, b: { times: any[] }) =>
                    Math.min(...a.times.map((time) => time?.time || 10000000)) -
                    Math.min(...b.times.map((time) => time?.time || 10000000))
                )}
                keyKey={'number'}
                runCount={runCount as number}
              />
            </div>
          ))}
        </Container>
      )
    } else {
      return null
    }
  } // This will never be called, but it is needed to make typescript happy

  const currentRunArray = allRuns.filter((a) => a.number === currentCompetitor)
  const currentRun = currentRunArray[0]

  // Calculate best times of day
  //

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

  const renderInfos = () => {
    const idx = currentRun.times.length - 1
    const times = currentRun.times[idx]

    if (typeof times !== 'undefined') {
      let {
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

      const tableFontSizeSml = '1rem'
      const tableFontSizeMid = '1.2rem'
      const tableFontSizeLarge = '1.4rem'
      const blockSize = 30

      return (
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
                  &Delta; PB
                </TableCell>
                <TableCell width={2} sx={{ fontSize: tableFontSizeMid }}>
                  &Delta; #1
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  Launch
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: blockSize,
                      height: blockSize,
                      backgroundColor: launchColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {launch !== 0
                    ? launch > 0
                      ? (launch / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {launch !== 0 &&
                  personalBestLaunch !== defaultBest &&
                  personalBestLaunch - defaultBest !== launchDeltaPB
                    ? launchDeltaPB > 0
                      ? '+' + (launchDeltaPB / 1000).toFixed(2)
                      : (launchDeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {launch !== 0 &&
                  bestLaunch !== defaultBest &&
                  bestLaunch - defaultBest !== launchDeltaLeader
                    ? launchDeltaLeader > 0
                      ? '+' + (launchDeltaLeader / 1000).toFixed(2)
                      : (launchDeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  Sector 1
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: blockSize,
                      height: blockSize,
                      backgroundColor: sector1Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector1 > 0
                    ? sector1 > 0
                      ? (sector1 / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector1 > 0 &&
                  personalBestSector1 !== defaultBest &&
                  personalBestSector1 - defaultBest !== sector1DeltaPB
                    ? sector1DeltaPB > 0
                      ? '+' + (sector1DeltaPB / 1000).toFixed(2)
                      : (sector1DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector1 > 0 &&
                  bestSector1 !== defaultBest &&
                  bestSector1 - defaultBest !== sector1DeltaLeader
                    ? sector1DeltaLeader > 0
                      ? '+' + (sector1DeltaLeader / 1000).toFixed(2)
                      : (sector1DeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  Sector 2
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: blockSize,
                      height: blockSize,
                      backgroundColor: sector2Colour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector2 > 0
                    ? sector2 > 0
                      ? (sector2 / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector2 > 0 &&
                  sector2DeltaPB !== 0 &&
                  personalBestSector2 !== defaultBest &&
                  personalBestSector2 - defaultBest !== sector2DeltaPB
                    ? sector2DeltaPB > 0
                      ? '+' + (sector2DeltaPB / 1000).toFixed(2)
                      : (sector2DeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {sector2 > 0 &&
                  sector2DeltaLeader !== 0 &&
                  bestSector2 !== defaultBest &&
                  bestSector2 - defaultBest !== sector2DeltaLeader
                    ? sector2DeltaLeader > 0
                      ? '+' + (sector2DeltaLeader / 1000).toFixed(2)
                      : (sector2DeltaLeader / 1000).toFixed(2)
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  Finish
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: blockSize,
                      height: blockSize,
                      backgroundColor: finishColour,
                      borderRadius: '4px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {finishTime > 0
                    ? finishTime > 0
                      ? (finishTime / 1000).toFixed(2)
                      : ''
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
                  {finishTime > 0 &&
                  finishDeltaPB !== 0 &&
                  personalBestFinishTime !== defaultBest &&
                  personalBestFinishTime - defaultBest !== finishDeltaPB
                    ? finishDeltaPB > 0
                      ? '+' + (finishDeltaPB / 1000).toFixed(2)
                      : (finishDeltaPB / 1000).toFixed(2)
                    : ''}
                </TableCell>
                <TableCell sx={{ fontSize: tableFontSizeLarge }}>
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
          <Grid sx={{ fontSize: tableFontSizeSml }}>
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

  let printClassesList = splitDisplay(classesList)
  const displayNumber = getDisplayNumber()

  const displayHeaders = {
    1: (
      <Box
        sx={{
          gridColumn: '3 / 5',
          height: 75,
          borderTop: 3,
          borderLeft: 3,
          borderBottom: 3,
          borderColor: 'primary.main',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          m: 1,
        }}
      >
        Southern District
      </Box>
    ),
    2: (
      <>
        <Box
          sx={{
            gridColumn: '1 / 3',
            height: 75,
            borderTop: 3,
            borderRight: 3,
            borderBottom: 3,
            borderColor: 'primary.main',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            m: 1,
          }}
        >
          Motorsports Association
        </Box>
        <Box
          sx={{
            gridColumn: '4 / 5',
          }}
        ></Box>
      </>
    ),
    3: (
      <Box
        component="img"
        sx={{
          gridColumn: '3 / 5',
          height: 75,
          m: 1,
        }}
        alt="image"
        src={String(Image2)}
      ></Box>
    ),
    4: (
      <Box
        sx={{
          gridColumn: '3 / 5',
          height: 75,
          m: 1,
        }}
      ></Box>
    ),
  }

  if (printClassesList) {
    return (
      <Container>
        {displayNumber == 0
          ? ''
          : displayNumber < 5
          ? displayHeaders[displayNumber]
          : ''}

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
                (a: { times: any[] }, b: { times: any[] }) =>
                  Math.min(...a.times.map((time) => time?.time || 10000000)) -
                  Math.min(...b.times.map((time) => time?.time || 10000000))
              )}
              keyKey={'number'}
              runCount={runCount as number}
            />
          </div>
        ))}
        {displayNumber === 4 ? (
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
              {renderInfos()}
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
