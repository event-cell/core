import React, { FC } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const ClassRecord: FC<{
  sector1: string
  sector2: string
  sector3: string
  finishTime: string
}> = ({ sector1, sector2, sector3, finishTime }) => (
  <Grid2
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
      {sector3}
    </Grid2>
    <Grid2
      xs={6}
      display="flex"
      justifyContent="right"
      alignItems="center"
      border="1px"
      color="darkorange"
      sx={{
        fontSize: '0.9rem',
        fontWeight: 700,
      }}
    >
      {finishTime}
    </Grid2>
    <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
      {sector1}
    </Grid2>
    <Grid2 xs={6} display="flex" justifyContent="right" alignItems="center">
      {sector2}
    </Grid2>
  </Grid2>
)
