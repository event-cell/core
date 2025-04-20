import React from 'react'
import { Typography, Box } from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'

export const Header: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 1, 
      p: 2,
      mb: 4
    }}>
      <TimerIcon color="primary" sx={{ fontSize: 60 }} />
      <Typography
        variant="h1"
        color="primary"
        sx={{ 
          fontSize: '4rem', 
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        SDMA Live Timing
      </Typography>
    </Box>
  )
}
