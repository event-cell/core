import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React from 'react'
import { RenderInfo } from '../display.js'
import { PrimaryPaper } from '../ui.js'
import { CompetitorList } from 'server/src/router/objects.js'

export const OnTrack = ({
  currentCompetitorId,
  competitors,
}: {
  competitors: CompetitorList
  currentCompetitorId: number
}) => {
  const currentRun = competitors.find(
    (competitor) => competitor.number === currentCompetitorId
  )

  if (!currentRun) return <div />

  // The speed for the run they are on. Taken from the run itself rather than
  // any earlier one: on a board describing the car currently out, a stale
  // number would be read as this run's.
  const latestRun = currentRun.times
    .filter((time) => time)
    .reduce<(typeof currentRun.times)[number]>(
      (latest, time) => (!latest || time!.run > latest.run ? time : latest),
      undefined,
    )
  const speed = latestRun?.speed

  return (
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
        <PrimaryPaper
          sx={{
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
          }}
        >
          ON TRACK
          <br />
          {currentRun.number}: {currentRun.firstName} {currentRun.lastName}
          {', '}
          {currentRun.vehicle}
          <br></br>
          {currentRun.class}
          {' · '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {typeof speed === 'number' ? `${Math.round(speed)} kph` : '-- kph'}
          </Box>
        </PrimaryPaper>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <RenderInfo currentRun={currentRun} allRuns={competitors} />
      </Grid>
    </Grid>
  )
}
