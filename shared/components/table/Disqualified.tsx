import React, { FC } from 'react'

import { Chip } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Cancel } from '@mui/icons-material'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from '.'

export const Disqualified = () => (
  <Grid2
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid2 xs={12} display="flex" justifyContent="left" alignItems="center">
      <Chip
        label="DSQ"
        variant="outlined"
        color="error"
        size="small"
        icon={<Cancel />}
      />
    </Grid2>
  </Grid2>
)
