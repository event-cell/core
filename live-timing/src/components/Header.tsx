import React from 'react'
import { Box, Typography } from '@mui/material'

export const Header: React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      mb: 4,
      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.03) 100%)',
      borderRadius: 3,
      border: '1px solid rgba(25, 118, 210, 0.12)',
      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
      backdropFilter: 'blur(15px)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.05) 50%, transparent 70%)',
        borderRadius: 3,
        zIndex: -1,
      },
    }}>
      <img
        src="/assets/display3-header.png"
        alt="SDMA Live Timing"
        style={{
          height: '75px',
          width: 'auto',
          maxWidth: '600px',
          filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.2))',
        }}
        onError={(e) => {
          console.error('Image failed to load:', e);
          // If image fails to load, show text instead
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const textElement = document.createElement('div');
            textElement.textContent = 'SDMA Live Timing';
            textElement.style.cssText = `
              font-size: 2rem;
              font-weight: bold;
              color: #1976d2;
              text-align: center;
            `;
            parent.appendChild(textElement);
          }
        }}
      />
    </Box>
  )
}
