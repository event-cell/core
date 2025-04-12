import React from 'react'

import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Cancel from '@mui/icons-material/Cancel'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const Disqualified = () => (
  <Grid
    container
    spacing={0.25}
    sx={{
      fontSize: MAIN_FONT_SIZE,
      width: MAIN_WIDTH,
    }}
  >
    <Grid size={{xs:12}} display="flex" justifyContent="left" alignItems="center">
      <Chip
        label="DSQ"
        variant="outlined"
        color="error"
        size="small"
        icon={<Cancel />}
      />
    </Grid>
  </Grid>
)
