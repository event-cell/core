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
export * from './display/MainDisplay.js'
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
            <Typography variant="h4" sx={{ mb: 2 }}>Fastest Times</Typography>

            {/* Podium Layout for Top 3 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2, position: 'relative', alignItems: 'flex-end' }}>
              {/* 2nd Place */}
              {getBestN(allRuns, 3)[1] && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 200,
                    height: 200,
                    backgroundColor: 'background.paper',
                    borderRadius: '8px',
                    border: '2px solid #C0C0C0',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 1,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#C0C0C0', fontWeight: 'bold', mb: 1 }}>
                    2nd
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#C0C0C0', textAlign: 'center', px: 1, fontWeight: 'bold', mb: 0.5 }}>
                    {(getBestN(allRuns, 3)[1]!.time / 1000).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#C0C0C0', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[1]!.name.split(' ').slice(0, -1).join(' ')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#C0C0C0', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[1]!.name.split(' ').slice(-1).join(' ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#C0C0C0', textAlign: 'center', px: 1, fontStyle: 'italic', fontSize: '0.8rem' }}>
                    {getBestN(allRuns, 3)[1]!.car}
                  </Typography>
                </Box>
              )}

              {/* 1st Place */}
              {getBestN(allRuns, 3)[0] && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 220,
                    height: 220,
                    backgroundColor: 'background.paper',
                    borderRadius: '8px',
                    border: '2px solid #FFD700',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                    1st
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#FFD700', textAlign: 'center', px: 1, fontWeight: 'bold', mb: 0.5 }}>
                    {(getBestN(allRuns, 3)[0]!.time / 1000).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#FFD700', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[0]!.name.split(' ').slice(0, -1).join(' ')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#FFD700', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[0]!.name.split(' ').slice(-1).join(' ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFD700', textAlign: 'center', px: 1, fontStyle: 'italic', fontSize: '0.8rem' }}>
                    {getBestN(allRuns, 3)[0]!.car}
                  </Typography>
                </Box>
              )}

              {/* 3rd Place */}
              {getBestN(allRuns, 3)[2] && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 200,
                    height: 180,
                    backgroundColor: 'background.paper',
                    borderRadius: '8px',
                    border: '2px solid #CD7F32',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 1,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#CD7F32', fontWeight: 'bold', mb: 1 }}>
                    3rd
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#CD7F32', textAlign: 'center', px: 1, fontWeight: 'bold', mb: 0.5 }}>
                    {(getBestN(allRuns, 3)[2]!.time / 1000).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CD7F32', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[2]!.name.split(' ').slice(0, -1).join(' ')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CD7F32', textAlign: 'center', px: 1, fontWeight: 500, mb: 0.5, lineHeight: 1.2 }}>
                    {getBestN(allRuns, 3)[2]!.name.split(' ').slice(-1).join(' ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CD7F32', textAlign: 'center', px: 1, fontStyle: 'italic', fontSize: '0.8rem' }}>
                    {getBestN(allRuns, 3)[2]!.car}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* List for positions 4-10 */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                Remaining Top 10
              </Typography>
              <Box component="ol" sx={{ pl: 3, m: 0, counterReset: 'list-counter' }}>
                {getBestN(allRuns, 10).slice(3).map((finish, index) => (
                  <Box
                    component="li"
                    key={index + 4}
                    sx={{
                      fontSize: '1.1rem',
                      mb: 1,
                      color: 'text.primary',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      '&::marker': {
                        content: `"${index + 4}."`,
                        fontWeight: 'bold',
                        color: 'white',
                      },
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {(finish.time / 1000).toFixed(2)}
                    </Box>
                    {' : '}
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      {finish.name}
                    </Box>
                    {' • '}
                    <Box component="span" sx={{ fontStyle: 'italic', color: 'text.secondary', fontSize: '0.9rem' }}>
                      {finish.car}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </PrimaryPaper>
      </Grid>
    </Grid>
  )
}
