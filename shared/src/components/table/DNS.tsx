import React, { FC } from 'react'

import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'

import MeetingRoom from '@mui/icons-material/MeetingRoom'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const DNS: FC<Record<string, never>> = () => (
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
        label="DNS"
        variant="outlined"
        color="info"
        size="small"
        icon={<MeetingRoom />}
      />
    </Grid>
  </Grid>
)
