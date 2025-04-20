import React from 'react'
import { Typography, Box } from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'

export const Header: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
      <TimerIcon color="primary" sx={{ fontSize: 40 }} />
      <Typography
        variant="h1"
        color="primary"
        sx={{ fontSize: '2.5rem', fontWeight: 500 }}
      >
        SDMA Live Timing
      </Typography>
    </Box>
  )
}
