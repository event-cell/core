import React, { FC } from 'react'

import { Chip } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import MeetingRoom from '@mui/icons-material/MeetingRoom'

import { MAIN_FONT_SIZE, MAIN_WIDTH } from './index'

export const DNS: FC<Record<string, never>> = () => (
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
        label="DNS"
        variant="outlined"
        color="info"
        size="small"
        icon={<MeetingRoom />}
      />
    </Grid2>
  </Grid2>
)
