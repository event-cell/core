import React, { FC } from 'react'

import { Chip } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { CarCrash } from '@mui/icons-material'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const DNF: FC<{
  sector1: string
  sector2: string
}> = ({ sector1, sector2 }) => (
  <Grid2
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid2 xs={12} display="flex" justifyContent="center" alignItems="center">
      <Chip
        label="DNF"
        variant="outlined"
        color="error"
        size="small"
        icon={<CarCrash />}
      />
    </Grid2>
    <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
      {sector1}
    </Grid2>
    <Grid2 xs={6} display="flex" justifyContent="right" alignItems="center">
      {sector2}
    </Grid2>
  </Grid2>
)
