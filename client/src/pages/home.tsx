// home.tsx — index of every screen this app serves

import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'

import { getRouterPrefix } from '../utils/routerPrefix.js'

interface Screen {
  name: string
  path: string
  purpose: string
  location: string
  /** Not listed on prefixed (publicly reachable) deploys — /admin has no authentication */
  adminOnly?: boolean
}

const SCREENS: Screen[] = [
  {
    name: 'Main Display',
    path: '/display',
    purpose: 'Every class on a single board',
    location: 'Single-screen setups',
  },
  {
    name: 'Display 1',
    path: '/display/1',
    purpose: 'Competitor leaderboard — board 1 (classes assigned automatically)',
    location: 'Cafe',
  },
  {
    name: 'Display 2',
    path: '/display/2',
    purpose: 'Competitor leaderboard — board 2 (classes assigned automatically)',
    location: 'Cafe',
  },
  {
    name: 'Display 3',
    path: '/display/3',
    purpose: 'Competitor leaderboard — board 3 (classes assigned automatically)',
    location: 'Cafe',
  },
  {
    name: 'Display 4',
    path: '/display/4',
    purpose: 'Overflow classes + On Track + Tri-Series points',
    location: 'Cafe',
  },
  {
    name: 'Track Display',
    path: '/trackdisplay',
    purpose: 'Live sector times for the competitor on course',
    location: 'Trackside',
  },
  {
    name: 'Announcer',
    path: '/announcer',
    purpose: 'Competitor info, class leaderboard and points',
    location: 'Announcer desk',
  },
  {
    name: 'Admin',
    path: '/admin',
    purpose: 'Configuration and end-of-day results',
    location: 'Staff only',
    adminOnly: true,
  },
]

export const HomePage = () => {
  const root = getRouterPrefix()

  // On a prefixed deploy the bundle is served from a public web server, so the
  // unauthenticated admin page is not advertised.
  const screens = root ? SCREENS.filter((screen) => !screen.adminOnly) : SCREENS
  const hrefFor = (path: string) => (root ? `/${root}${path}` : path)

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        SDMA Timing
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Available screens
      </Typography>

      <Grid container spacing={2}>
        {screens.map((screen) => (
          <Grid key={screen.path} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                component={RouterLink}
                to={hrefFor(screen.path)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {screen.name}
                    </Typography>
                    <Chip label={screen.location} size="small" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', mb: 1 }}
                    color="primary"
                  >
                    {hrefFor(screen.path)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {screen.purpose}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
