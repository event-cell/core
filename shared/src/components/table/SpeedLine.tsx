import React, { FC } from 'react'

import Grid from '@mui/material/Grid'

import { NO_SPEED, SPEED_FONT_SIZE } from './index.js'

/**
 * The speed for a run, on its own line beneath the sector times.
 *
 * Left-aligned so it sits under sector3 and sector1 rather than floating in the
 * middle of the cell, and muted so the times stay dominant. Every run cell
 * carries this line — showing `--` when there is no speed — so cells keep a
 * uniform height and rows stay aligned across classes.
 */
export const SpeedLine: FC<{ speed?: number }> = ({ speed }) => (
  <Grid
    size={{ xs: 12 }}
    display="flex"
    justifyContent="left"
    alignItems="center"
    sx={{ fontSize: SPEED_FONT_SIZE, color: 'text.secondary' }}
  >
    {typeof speed === 'number' ? `${Math.round(speed)} kph` : NO_SPEED}
  </Grid>
)
