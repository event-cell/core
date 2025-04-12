import React, { FC } from 'react'

import Grid from '@mui/material/Grid'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const Regular: FC<{
  sector1: string
  sector2: string
  sector3: string
  finishTime: string
}> = ({ sector1, sector2, sector3, finishTime }) => (
  <Grid
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid size={{xs:6}} display="flex" justifyContent="left" alignItems="center">
      {sector3}
    </Grid>
    <Grid
      size={{xs:6}}
      display="flex"
      justifyContent="right"
      alignItems="center"
      border="1px"
      color="primary.dark"
      sx={{ fontSize: '0.9rem', fontWeight: 700 }}
    >
      {finishTime}
    </Grid>
    <Grid size={{xs:6}} display="flex" justifyContent="left" alignItems="center">
      {sector1}
    </Grid>
    <Grid size={{xs:6}} display="flex" justifyContent="right" alignItems="center">
      {sector2}
    </Grid>
  </Grid>
)
