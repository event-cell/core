import React, { FC } from 'react'
import { Box, Typography, Paper, Chip } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import type { ClubPoints } from '../../logic/clubPoints.js'

interface ClubPointsDisplayProps {
    clubPoints: ClubPoints[]
    maxDisplay?: number
}

export const ClubPointsDisplay: FC<ClubPointsDisplayProps> = ({
    clubPoints,
    maxDisplay = 10
}) => {
    if (clubPoints.length === 0) return null

    const topClubs = clubPoints.slice(0, maxDisplay)

    return (
        <Paper
            sx={{
                p: 2,
                m: 1,
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents sx={{ color: 'gold', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Tri-Series Points
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {topClubs.map((club, index) => (
                    <Chip
                        key={club.club}
                        label={`${index + 1}. ${club.club} (${club.points}pts)`}
                        icon={index < 3 ? <EmojiEvents sx={{ color: index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32' }} /> : undefined}
                        sx={{
                            backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.2)' :
                                index === 1 ? 'rgba(192, 192, 192, 0.2)' :
                                    index === 2 ? 'rgba(205, 127, 50, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                            border: index < 3 ? '2px solid' : '1px solid',
                            borderColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'divider',
                            fontWeight: index < 3 ? 'bold' : 'normal',
                            fontSize: index < 3 ? '1rem' : '0.9rem',
                        }}
                    />
                ))}
            </Box>
        </Paper>
    )
}
