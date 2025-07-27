import React, { FC } from 'react'

import { Chip } from '@mui/material'
import Grid from '@mui/material/Grid'
import CarCrash from '@mui/icons-material/CarCrash'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index.js'

export const DNF: FC<{
  sector1: string
  sector2: string
}> = ({ sector1, sector2 }) => (
  <Grid
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid size={{xs:12}} display="flex" justifyContent="center" alignItems="center">
      <Chip
        label="DNF"
        variant="outlined"
        color="error"
        size="small"
        icon={<CarCrash />}
      />
    </Grid>
    <Grid size={{xs:6}} display="flex" justifyContent="left" alignItems="center">
      {sector1}
    </Grid>
    <Grid size={{xs:6}} display="flex" justifyContent="right" alignItems="center">
      {sector2}
    </Grid>
  </Grid>
)
