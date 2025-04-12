import Grid from '@mui/material/Grid'
import React from 'react'
import { RenderInfo } from '../display'
import { PrimaryPaper } from '../ui'
import { CompetitorList } from 'server/src/router/objects'

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
      <Grid size={{ xs:4 }}>
        <RenderInfo currentRun={currentRun} allRuns={competitors} />
      </Grid>
    </Grid>
  )
}
