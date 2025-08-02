import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'

const liveTimingBanner = (
    <Box
        sx={{
            gridColumn: '1 / 5',
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            m: 1,
            px: 2,
            py: 2,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
            backdropFilter: 'blur(10px)',
        }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: '800',
                    color: 'primary.main',
                    fontSize: '1.4rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 2px rgba(25, 118, 210, 0.2)',
                    mb: 0.5,
                }}
            >
                Live Timing
            </Typography>
        </Box>
        <Box
            sx={{
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    right: -4,
                    bottom: -4,
                    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                    borderRadius: 1,
                    zIndex: -1,
                },
            }}
        >
                         <QRCodeSVG
                 value="https://timing.sdmahillclimb.com.au"
                 size={120}
                 level="M"
                 includeMargin={true}
                 style={{
                     borderRadius: '8px',
                     boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                 }}
             />
        </Box>
    </Box>
)

export const DisplayFooter: FC<{ display: number }> = ({ display }) => {
    if (display == 0) return <div />

    if (display >= 1 && display <= 4) return liveTimingBanner

    return <div />
} 