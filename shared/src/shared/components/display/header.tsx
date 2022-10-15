import React, { FC } from 'react'
import { Box } from '@mui/material'

import Image2 from '../../assets/image2.jpeg'

const displayHeaders = {
  1: (
    <Box
      sx={{
        gridColumn: '3 / 5',
        height: 75,
        borderTop: 3,
        borderLeft: 3,
        borderBottom: 3,
        borderColor: 'primary.main',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '700',
        m: 1,
      }}
    >
      Southern District
    </Box>
  ),
  2: (
    <>
      <Box
        sx={{
          gridColumn: '1 / 3',
          height: 75,
          borderTop: 3,
          borderRight: 3,
          borderBottom: 3,
          borderColor: 'primary.main',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          m: 1,
        }}
      >
        Motorsports Association
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
      component="img"
      sx={{
        gridColumn: '3 / 5',
        height: 75,
        m: 1,
      }}
      alt="image"
      src={String(Image2)}
    ></Box>
  ),
  4: (
    <Box
      sx={{
        gridColumn: '3 / 5',
        height: 75,
        m: 1,
      }}
    ></Box>
  ),
}

export const DisplayHeader: FC<{ display: number }> = ({ display }) => {
  if (display == 0) return <div />

  if (display < 5) return displayHeaders[display as 1 | 2 | 3 | 4]

  return <div />
}
