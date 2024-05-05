import {
  Box,
  Grid,
  Paper,
  styled,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { FC } from 'react'

import {
  calculateDeltas,
  calculateTimes,
  getClassBestSectors,
  getGlobalBestSectors,
  getPersonalBestSectors,
  getPersonalBestTotal,
  getSectorColors,
  getBestFinishTheWorseVersion,
  getGlobalBestFinish,
  type GetBestFinish,
  getFemaleBestFinish,
  getJuniorBestFinish,
} from '../logic'

import { Competitor, CompetitorList } from 'server/src/router/objects'

export * from './display/CompetitorList'
export * from './display/OnTrack'

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}))

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

  previousPB: number | null
  previousGlobalBest: number | null
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
        {time > 0 ? (time / 1000).toFixed(2) : ''}
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

const bestFinishTimeText = (
  title: string,
  processor: GetBestFinish,
  competitors: CompetitorList
) => {
  const { time, name, car } = processor(competitors)
  if (name === '') return ''
  return `${title}: ${(time / 1000).toFixed(2)} by ${name} in the ${car}`
}

export const RenderInfo: FC<{
  currentRun: Competitor
  allRuns: CompetitorList
}> = ({ currentRun, allRuns }) => {
  const defaultBest = Number.MAX_SAFE_INTEGER

  const { classIndex } = currentRun

  const idx = currentRun.times.length - 1
  const splits = currentRun.times[idx]!

  const times = calculateTimes(splits)
  const globalBest = getGlobalBestSectors(allRuns)
  const personalBest = getPersonalBestSectors(currentRun)
  const classBest = getClassBestSectors(classIndex, allRuns)

  const {
    first: sector1Colour,
    second: sector2Colour,
    third: sector3Colour,
    finish: finishColour,
  } = getSectorColors(classBest, personalBest, times)

  const [personalBestFinishTime, previousPersonalBestFinishTime] =
    getPersonalBestTotal(currentRun)
  const [bestFinishTime, previousBestFinishTime] =
    getBestFinishTheWorseVersion(allRuns)

  const {
    bestSector1,
    bestSector2,
    bestSector3,
    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
  } = classBest

  const {
    bestSector1: personalBestSector1,
    bestSector2: personalBestSector2,
    bestSector3: personalBestSector3,
    previousBestSector1: previousPersonalBestSector1,
    previousBestSector2: previousPersonalBestSector2,
    previousBestSector3: previousPersonalBestSector3,
  } = personalBest

  const { sector1, sector2, sector3, finish } = times

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
            {bestFinishTimeText('Outright', getGlobalBestFinish, allRuns)}
            <br />
            {bestFinishTimeText('Lady', getFemaleBestFinish, allRuns)}
            <br />
            {bestFinishTimeText('Junior', getJuniorBestFinish, allRuns)}
            <br />
          </Grid>
        </PrimaryPaper>
      </Grid>
    </Grid>
  )
}
