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

import { CompetitorTable } from './table'
import Timer from '@mui/icons-material/Timer'

import {
  calculateDeltas,
  calculateTimes,
  getClassBest,
  getPersonalBest,
  getPersonalBestSector,
  getPersonalBestTotal,
  RankTimes,
} from '../logic'

import { Competitor, CompetitorList } from 'server/src/router/objects'
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

type ItemizedClassType = ClassType & { startItem: number }

/**
 * This is the internal logic of the {@link splitDisplay} function. It is here
 * to make it easier to test
 */
export const splitDisplayLogic = ({
  classesList,
  screenIndex,
  itemsPerScreen,
}: {
  classesList: ItemizedClassType[]
  screenIndex: number
  itemsPerScreen: number
}): ItemizedClassType[] =>
  classesList.filter(
    (classInfo) =>
      // If the class was not on the last screen
      classInfo.startItem >= (screenIndex - 1) * itemsPerScreen &&
      // If the class is not large enough to be on the next screen
      classInfo.startItem < screenIndex * itemsPerScreen
  )

function splitDisplay(classesList: ClassType[]) {
  if (
    typeof window == 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/')
  )
    return classesList

  let items = 0
  const itemizedClassesList: ItemizedClassType[] = classesList.map(
    (classType) => {
      const startItem = items
      items += classType.drivers.length

      return {
        ...classType,
        startItem,
      } satisfies ItemizedClassType
    }
  )

  // Calculate ClassesList for each screen.
  const numberOfScreens = 4 // TODO: This should be configurable
  const itemsPerScreen = Math.ceil(items / numberOfScreens)

  try {
    const screenIndex = Number.parseInt(
      window.location.pathname.replace('/display/', '')
    )

    return splitDisplayLogic({
      classesList: itemizedClassesList,
      screenIndex,
      itemsPerScreen,
    })
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
  runCount: number | null
}> = ({ currentCompetitor, allRuns, runCount }) => {
  // Make sure there are no duplicate classes in the list
  const classes = useMemo(
    () =>
      allRuns.reduce<{ classIndex: number; class: string }[]>(
        (all, current) => {
          const currentRunIncluded = all.some(
            (cls) => cls.classIndex == current.classIndex
          )
          if (currentRunIncluded) return all

          return [
            ...all,
            { classIndex: current.classIndex, class: current.class },
          ]
        },
        []
      ),
    [allRuns]
  )

  const classListForDisplay = useMemo(() => {
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
    return displayContent
  }, [classes])

  if (!currentCompetitor || !runCount) {
    console.warn('Missing currentCompetitor or runCount data')
    return <div />
  } // This will never be called, but it is needed to make typescript happy

  const currentRun = allRuns.find((a) => a.number === currentCompetitor)
  if (!currentRun) return null

  const displayNumber = getDisplayNumber()
  if (!classListForDisplay) return null

  return (
    <Container>
      <DisplayHeader display={displayNumber} />

      {classListForDisplay.map((eventClass) => (
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
          <CompetitorTable
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
              {currentRun.number}: {currentRun.firstName} {currentRun.lastName}
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
            <CompetitorTable
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
  sectorPB,
  bestSector,
  sectorColor,
  defaultBest,

  previousPB,
  previousGlobalBest,
}: {
  sectorName: string
  time: number
  sectorPB: number
  bestSector: number
  sectorColor: string
  defaultBest: number

  previousPB: number
  previousGlobalBest: number
}) {
  const { deltaPB, deltaLeader } = calculateDeltas({
    time,
    pb: sectorPB,
    previousPB,
    globalBest: bestSector,
    previousGlobalBest,
  })

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

export const RenderInfo: FC<{
  currentRun: Competitor
  allRuns: CompetitorList
}> = ({ currentRun, allRuns }) => {
  const {
    sector1Colour,
    sector2Colour,
    sector3Colour,
    finishColour,
    bestFinishTime,
    previousBestFinishTime,
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

  const { classIndex } = currentRun

  const {
    bestSector1,
    bestSector2,
    bestSector3,
    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
  } = useMemo(() => getClassBest(classIndex, allRuns), [classIndex, allRuns])

  const { personalBestFinishTime, previousPersonalBestFinishTime } = useMemo(
    () => getPersonalBestTotal(currentRun),
    [currentRun]
  )

  const {
    bestSector1: personalBestSector1,
    bestSector2: personalBestSector2,
    bestSector3: personalBestSector3,
    previousBestSector1: previousPersonalBestSector1,
    previousBestSector2: previousPersonalBestSector2,
    previousBestSector3: previousPersonalBestSector3,
  } = useMemo(() => getPersonalBest(currentRun), [currentRun])

  const idx = currentRun.times.length - 1
  const times = currentRun.times[idx]

  if (typeof times == 'undefined') return <div />

  const { sector1, sector2, sector3, finish } = calculateTimes(times)

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
                sectorPB={personalBestSector1}
                bestSector={bestSector1}
                sectorColor={sector1Colour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestSector1}
                previousGlobalBest={previousBestSector1}
              />

              <RenderSector
                sectorName={'Sector 2'}
                time={sector2}
                sectorPB={personalBestSector2}
                bestSector={bestSector2}
                sectorColor={sector2Colour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestSector2}
                previousGlobalBest={previousBestSector2}
              />

              <RenderSector
                sectorName={'Sector 3'}
                time={sector3}
                sectorPB={personalBestSector3}
                bestSector={bestSector3}
                sectorColor={sector3Colour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestSector3}
                previousGlobalBest={previousBestSector3}
              />

              <RenderSector
                sectorName={'Finish'}
                time={finish}
                sectorPB={personalBestFinishTime}
                bestSector={bestFinishTime}
                sectorColor={finishColour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestFinishTime}
                previousGlobalBest={previousBestFinishTime}
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
