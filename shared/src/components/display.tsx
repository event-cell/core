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
  Typography,
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
  getGlobalBestFinish,
  type GetBestFinish,
  getBestN,
} from '../logic/index.js'

import { Competitor, CompetitorList } from 'server/src/router/objects.js'

export * from './display/CompetitorList.js'
export * from './display/OnTrack.js'
export * from './display/footer.js'

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
  previousClassBest,
}: {
  sectorName: string
  time: number
  sectorPB: number
  bestSector: number
  sectorColor: string
  defaultBest: number
  previousPB: number | null
  previousClassBest: number | null
}) {
  const { deltaPB, deltaClassLeader } = calculateDeltas({
    time,
    pb: sectorPB,
    previousPB,
    classBest: bestSector,
    previousClassBest,
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
          bestSector - defaultBest !== deltaClassLeader
          ? deltaClassLeader > 0
            ? '+' + (deltaClassLeader / 1000).toFixed(2)
            : (deltaClassLeader / 1000).toFixed(2)
          : ''}
      </TableCell>
    </TableRow>
  )
}

export const RenderInfo: FC<{
  currentRun: Competitor
  allRuns: CompetitorList
}> = ({ currentRun, allRuns }) => {
  const defaultBest = Number.MAX_SAFE_INTEGER

  const { classIndex } = currentRun

  // Check if there are any times
  const hasTimes = currentRun.times.length > 0;

  // Only calculate times if there are any
  let times = { sector1: 0, sector2: 0, sector3: 0, finish: 0 };
  if (hasTimes) {
    const idx = currentRun.times.length - 1;
    const splits = currentRun.times[idx]!;
    times = calculateTimes(splits);
  }

  const personalBest = getPersonalBestSectors(currentRun)
  const classBest = getClassBestSectors(classIndex, allRuns)

  const {
    first: sector1Colour,
    second: sector2Colour,
    third: sector3Colour,
    finish: finishColour,
  } = getSectorColors(classBest, personalBest, times)

  const {
    bestSector1,
    bestSector2,
    bestSector3,
    bestFinish,
    previousBestSector1,
    previousBestSector2,
    previousBestSector3,
    previousBestFinish,
  } = classBest

  const {
    bestSector1: personalBestSector1,
    bestSector2: personalBestSector2,
    bestSector3: personalBestSector3,
    bestFinish: personalBestFinish,
    previousBestSector1: previousPersonalBestSector1,
    previousBestSector2: previousPersonalBestSector2,
    previousBestSector3: previousPersonalBestSector3,
    previousBestFinish: previousPersonalBestFinish,
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
                previousClassBest={previousBestSector1}
              />

              <RenderSector
                sectorName={'Sector 2'}
                time={sector2}
                sectorPB={personalBestSector2}
                bestSector={bestSector2}
                sectorColor={sector2Colour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestSector2}
                previousClassBest={previousBestSector2}
              />

              <RenderSector
                sectorName={'Sector 3'}
                time={sector3}
                sectorPB={personalBestSector3}
                bestSector={bestSector3}
                sectorColor={sector3Colour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestSector3}
                previousClassBest={previousBestSector3}
              />

              <RenderSector
                sectorName={'Finish'}
                time={finish}
                sectorPB={personalBestFinish}
                bestSector={bestFinish}
                sectorColor={finishColour}
                defaultBest={defaultBest}
                previousPB={previousPersonalBestFinish}
                previousClassBest={previousBestFinish}
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
            <Typography variant="h4">Fastest Times</Typography>
            <ol>
              {getBestN(allRuns, 10).map((finish) => (
                <li>
                  {(finish.time / 1000).toFixed(2)} : {finish.name} [
                  {finish.car}]{' '}
                </li>
              ))}
            </ol>
          </Grid>
        </PrimaryPaper>
      </Grid>
    </Grid>
  )
}
