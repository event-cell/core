import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'

const displayHeaders = {
  1: (
    <Box
      sx={{
        gridColumn: '3 / 5',
        height: 75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        m: 1,
        px: 2,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
        borderRadius: 2,
        border: '1px solid rgba(25, 118, 210, 0.1)',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.03) 50%, transparent 70%)',
          borderRadius: 2,
          zIndex: -1,
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: '800',
          color: 'primary.main',
          fontSize: '1.8rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          textShadow: '0 1px 2px rgba(25, 118, 210, 0.2)',
          textAlign: 'center',
        }}
      >
        Southern District
      </Typography>
    </Box>
  ),
  2: (
    <>
      <Box
        sx={{
          gridColumn: '1 / 3',
          height: 75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: 1,
          px: 2,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
          borderRadius: 2,
          border: '1px solid rgba(25, 118, 210, 0.1)',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.03) 50%, transparent 70%)',
            borderRadius: 2,
            zIndex: -1,
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: '800',
            color: 'primary.main',
            fontSize: '1.6rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(25, 118, 210, 0.2)',
            textAlign: 'center',
          }}
        >
          Motorsports Association
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: '4 / 5',
        }}
      ></Box>
    </>
  ),
  3: (
    <Box
      sx={{
        gridColumn: '3 / 5',
        height: 75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        m: 1,
        px: 2,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%), url("/assets/display3-header.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 2,
        border: '1px solid rgba(25, 118, 210, 0.15)',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
        backdropFilter: 'blur(5px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.1) 50%, transparent 70%)',
          borderRadius: 2,
          zIndex: -1,
        },
      }}
    />
  ),
  4: (
    <Box
      sx={{
        gridColumn: '1 / 5',
        height: 75,
        m: 1,
      }}
    />
  ),
}

export const DisplayHeader: FC<{ display: number }> = ({ display }) => {
  if (display == 0) return <div />

  if (display < 5) return displayHeaders[display as 1 | 2 | 3 | 4]

  return <div />
}
