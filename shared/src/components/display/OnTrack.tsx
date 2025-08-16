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
        </PrimaryPaper>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <RenderInfo currentRun={currentRun} allRuns={competitors} />
      </Grid>
    </Grid>
  )
}
