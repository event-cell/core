import React, { useEffect, useState } from 'react'
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'
import type { EventData } from './types/global.d.ts'
import { EventList } from './components/EventList.js'
import { Header } from './components/Header.js'
import { PersonalHistoryPage } from './pages/PersonalHistoryPage.js'
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'
import HistoryIcon from '@mui/icons-material/History'

interface Event {
  date: string
  eventName: string
  eventId: string
  isCurrentEvent: boolean
}

interface AppProps {
  initialEvents?: Event[]
}

interface MetadataResponse {
  eventDirectories: string[]
  metadataMap: Record<string, any>
}

interface EventMetadata {
  eventName: string
  eventId: string
  isCurrentEvent: boolean
  lastUpdated: string
}

export default function App(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventDirectories, setEventDirectories] = useState<string[]>([])
  const [isHistoricalLoading, setIsHistoricalLoading] = useState(false)
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchHistoricalEvents = async () => {
    try {
      setIsHistoricalLoading(true)
      const response = await fetch('/site-metadata.json')
      if (!response.ok) {
        throw new Error('Failed to fetch historical events')
      }
      const data = await response.json() as MetadataResponse
      if (data && Array.isArray(data.eventDirectories)) {
        setEventDirectories(data.eventDirectories)
        setEvents(
          data.eventDirectories.map((date) => ({
            date,
            eventName: data.metadataMap[date]?.eventName || `Event ${date}`,
            eventId: date,
            isCurrentEvent: false,
          })),
        )
      }
    } catch (error) {
      console.error('Error fetching historical events:', error)
    } finally {
      setIsHistoricalLoading(false)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/site-metadata.json')
        if (!response.ok) {
          throw new Error(
            `Failed to load events: ${response.status} ${response.statusText}`,
          )
        }
        const metadataData = (await response.json()) as MetadataResponse

        // Check if eventDirectories exists and is an array
        if (metadataData && Array.isArray(metadataData.eventDirectories)) {
          setEvents(
            metadataData.eventDirectories.map((date) => ({
              date,
              eventName:
                metadataData.metadataMap[date]?.eventName || `Event ${date}`,
              eventId: date,
              isCurrentEvent: false,
            })),
          )
          setEventDirectories(metadataData.eventDirectories)
        } else {
          console.warn('No event directories found in data.json')
          setEvents([])
          setEventDirectories([])
        }
      } catch (err) {
        console.error('Error loading events:', err)
        setError(err instanceof Error ? err.message : 'Failed to load events')
        setEvents([])
        setEventDirectories([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handlePersonalHistoryClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetchHistoricalEvents();
    navigate('/personal-history');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 'bold',
              letterSpacing: { xs: '-0.02em', sm: '-0.01em' }
            }}
          >
            Live Timing Events
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            paragraph
            sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}
          >
            Loading events...
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 3, sm: 4 } }}>
          <CircularProgress />
        </Box>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
          >
            Live Timing System
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 'bold',
              letterSpacing: { xs: '-0.02em', sm: '-0.01em' }
            }}
          >
            Live Timing Events
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            paragraph
            sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}
          >
            Error loading events: {error}
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 }, my: { xs: 2, sm: 3 }, bgcolor: 'info.light' }}>
          <Typography 
            color="info" 
            align="center"
            sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}
          >
            {error}
          </Typography>
        </Paper>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
          >
            Live Timing System
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container maxWidth="md">
            <Header />
            <div className="button-container">
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', lg: 'row' },
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: { xs: 4, lg: 2 }, 
                  my: { xs: 5, lg: 4 },
                  width: '100%',
                  px: { xs: 3, lg: 0 },
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}
              >
                <Button
                  component="a"
                  href="/live-timing/display/"
                  variant="contained"
                  size="large"
                  startIcon={isMobile ? null : <TimerIcon />}
                  className="current-event-button"
                  fullWidth={false}
                  sx={{ 
                    py: { xs: 3, lg: 2 },
                    px: { xs: 3, lg: 3 },
                    fontSize: { xs: '3rem', lg: '2rem' },
                    fontWeight: 'bold',
                    height: { xs: '108px', lg: '72px' },
                    borderRadius: { xs: '12px', lg: '4px' },
                    boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.2)', lg: 'none' },
                    letterSpacing: { xs: '0.5px', lg: 'normal' },
                    textShadow: { xs: '0 1px 2px rgba(0,0,0,0.2)', lg: 'none' },
                    width: '90%',
                    '@media (orientation: portrait)': {
                      fontSize: '3.5rem',
                      height: '120px',
                      py: 3.5,
                      px: 4,
                      borderRadius: '16px',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 2, lg: 1 },
                      '& > *:first-of-type': {
                        fontSize: { xs: '3rem', lg: '2rem' }
                      }
                    },
                    '@media (orientation: portrait) .MuiButton-startIcon > *:first-of-type': {
                      fontSize: '3.5rem'
                    }
                  }}
                >
                  Live Timing
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/personal-history"
                  variant="contained"
                  size="large"
                  startIcon={isMobile ? null : <HistoryIcon />}
                  onClick={handlePersonalHistoryClick}
                  disabled={isHistoricalLoading}
                  className="personal-history-button"
                  fullWidth={false}
                  sx={{ 
                    py: { xs: 3, lg: 2 },
                    px: { xs: 3, lg: 3 },
                    fontSize: { xs: '3rem', lg: '2rem' },
                    fontWeight: 'bold',
                    height: { xs: '108px', lg: '72px' },
                    borderRadius: { xs: '12px', lg: '4px' },
                    boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.2)', lg: 'none' },
                    letterSpacing: { xs: '0.5px', lg: 'normal' },
                    textShadow: { xs: '0 1px 2px rgba(0,0,0,0.2)', lg: 'none' },
                    width: '90%',
                    '@media (orientation: portrait)': {
                      fontSize: '3.5rem',
                      height: '120px',
                      py: 3.5,
                      px: 4,
                      borderRadius: '16px',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 2, lg: 1 },
                      '& > *:first-of-type': {
                        fontSize: { xs: '3rem', lg: '2rem' }
                      }
                    },
                    '@media (orientation: portrait) .MuiButton-startIcon > *:first-of-type': {
                      fontSize: '3.5rem'
                    }
                  }}
                >
                  {isHistoricalLoading ? 'Loading...' : 'Personal History'}
                </Button>
              </Box>
            </div>

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            <Box sx={{ mt: { xs: 3, sm: 4 } }}>
              <Box sx={{ 
                '& .MuiTypography-root': {
                  fontSize: { xs: '3rem', sm: '2.5rem' }
                },
                '& .MuiListItem-root': {
                  py: { xs: 3, sm: 2.5 }
                },
                '& .MuiListItemText-primary': {
                  fontSize: { xs: '3.5rem', sm: '3rem' },
                  fontWeight: { xs: 'bold', sm: 'bold' }
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '3rem', sm: '2.5rem' }
                }
              }}>
                <EventList
                  initialEventDirectories={eventDirectories}
                  initialMetadataMap={events.reduce((acc, event) => {
                    acc[event.date] = {
                      eventName: event.eventName,
                      eventId: event.eventId,
                      isCurrentEvent: event.isCurrentEvent,
                      lastUpdated: new Date().toISOString()
                    }
                    return acc
                  }, {} as Record<string, EventMetadata | null>)}
                />
              </Box>
            </Box>

            <Box sx={{ mt: { xs: 6, sm: 8 }, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
              >
                Live Timing System &copy; {new Date().getFullYear()}
              </Typography>
            </Box>
          </Container>
        }
      />
      <Route
        path="/live-timing"
        element={
          <EventList
            initialEventDirectories={eventDirectories}
            initialMetadataMap={events.reduce((acc, event) => {
              acc[event.date] = {
                eventName: event.eventName,
                eventId: event.eventId,
                isCurrentEvent: event.isCurrentEvent,
                lastUpdated: new Date().toISOString()
              }
              return acc
            }, {} as Record<string, EventMetadata | null>)}
          />
        }
      />
      <Route
        path="/personal-history"
        element={<PersonalHistoryPage />}
      />
    </Routes>
  )
}
