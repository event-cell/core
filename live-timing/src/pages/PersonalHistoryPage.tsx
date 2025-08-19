import React, { useState, useEffect, useMemo, useCallback, FC, useRef } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { 
  Box, 
  TextField, 
  Typography, 
  CircularProgress, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Link,
  Collapse,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { EventMetadata, fetchEventsMetadata } from '../utils/metadataUtils.js';

interface Competitor {
  firstName: string;
  lastName: string;
  number: string;
  vehicle: string;
  class: string;
  classIndex: number;
  times: Array<{
    run: number;
    time: number;
    split1: number;
    split2: number;
    status: number;
  }>;
}

interface EventData {
  date: string;
  eventName: string;
  competitors: Competitor[];
}

interface SiteMetadata {
  eventDirectories: string[];
  metadataMap: Record<string, EventMetadata | null>;
}

interface PersonalBest {
  bestTime: number;
  bestSector1: number;
  bestSector2: number;
  bestSector3: number;
  eventName: string;
  date: string;
  isTwoLap?: boolean;
}

interface PersonalBestSummaryProps {
  personalBest: PersonalBest | null;
  eventCount?: number;
}

const PersonalBestSummary: FC<PersonalBestSummaryProps> = ({ personalBest, eventCount = 0 }) => {
  if (!personalBest) {
    return null;
  }

  const formatTime = (time: number): string => {
    return time > 0 ? (time / 1000).toFixed(2) + 's' : 'N/A';
  };

  const theoreticalBest = personalBest.bestSector1 > 0 && 
                         personalBest.bestSector2 > 0 && 
                         personalBest.bestSector3 > 0
    ? (personalBest.bestSector1 + personalBest.bestSector2 + personalBest.bestSector3) / 1000
    : null;

  return (
    <Card sx={{ 
      mb: 4, 
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 2,
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 'bold'
          }}
        >
          Personal Best Summary ({personalBest.isTwoLap ? '2 Lap' : '1 Lap'})
          <Typography 
            component="span" 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ 
              ml: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 'normal'
            }}
          >
            ({eventCount} {eventCount === 1 ? 'event' : 'events'})
          </Typography>
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Best Time
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {formatTime(personalBest.bestTime)}
              </Typography>
              {personalBest.bestTime > 0 && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  {personalBest.eventName} ({personalBest.date})
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Best Sector 1
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {formatTime(personalBest.bestSector1)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Best Sector 2
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {formatTime(personalBest.bestSector2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Best Sector 3
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {formatTime(personalBest.bestSector3)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider' 
            }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Theoretical Best Time
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {theoreticalBest !== null ? `${theoreticalBest.toFixed(2)}s` : 'N/A'}
              </Typography>
              {theoreticalBest !== null && personalBest.bestTime > 0 && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  {((personalBest.bestTime / 1000) - theoreticalBest).toFixed(2)}s faster than actual best
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const PersonalHistoryPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [personalBest, setPersonalBest] = useState<PersonalBest | null>(null);
  const [twoLapPersonalBest, setTwoLapPersonalBest] = useState<PersonalBest | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [eventCounts, setEventCounts] = useState<{ singleLap: number; twoLap: number }>({ singleLap: 0, twoLap: 0 });
  
  const workerRef = useRef<Worker | null>(null);

  // Initialize web worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/searchWorker.ts', import.meta.url));
    
    workerRef.current.onmessage = (e: MessageEvent) => {
      const { filteredEvents, personalBest, twoLapPersonalBest, debugLog, eventCounts } = e.data;
      setFilteredEvents(filteredEvents);
      setPersonalBest(personalBest);
      setTwoLapPersonalBest(twoLapPersonalBest);
      setIsSearching(false);
      
      // Update debug info if available
      if (debugLog) {
        setDebugInfo(debugLog);
      }
      
      // Update event counts
      if (eventCounts) {
        setEventCounts(eventCounts);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Handle search submission
  const handleSearch = () => {
    if (!workerRef.current) return;
    
    setIsSearching(true);
    workerRef.current.postMessage({
      events: allEvents,
      searchTerm
    });
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Update filtered events when search query changes
  // Only reset to all events when the search is cleared. Avoid per-keystroke filtering to improve performance.
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(allEvents);
    }
  }, [searchTerm, allEvents]);

  // Memoize personal best calculations
  const calculatePersonalBests = useCallback((events: EventData[]) => {
    let bestTime = Infinity;
    let bestSector1 = Infinity;
    let bestSector2 = Infinity;
    let bestSector3 = Infinity;
    let bestEventName = '';
    let bestDate = '';

    let twoLapBestTime = Infinity;
    let twoLapBestSector1 = Infinity;
    let twoLapBestSector2 = Infinity;
    let twoLapBestSector3 = Infinity;
    let twoLapBestEventName = '';
    let twoLapBestDate = '';

    events.forEach(event => {
      const isTwoLapEvent = /2\s+lap/i.test(event.eventName) || 
                           /2-lap/i.test(event.eventName) ||
                           /two\s+lap/i.test(event.eventName);
      
      event.competitors.forEach(competitor => {
        competitor.times.forEach(time => {
          if (time.status === 0) {
            if (isTwoLapEvent) {
              if (time.time < twoLapBestTime) {
                twoLapBestTime = time.time;
                twoLapBestEventName = event.eventName;
                twoLapBestDate = event.date;
              }
              
              if (time.split1 < twoLapBestSector1) {
                twoLapBestSector1 = time.split1;
              }
              
              const sector2 = time.split2 - time.split1;
              if (sector2 < twoLapBestSector2) {
                twoLapBestSector2 = sector2;
              }
              
              const sector3 = time.time - time.split2;
              if (sector3 < twoLapBestSector3) {
                twoLapBestSector3 = sector3;
              }
            } else {
              if (time.time < bestTime) {
                bestTime = time.time;
                bestEventName = event.eventName;
                bestDate = event.date;
              }
              
              if (time.split1 < bestSector1) {
                bestSector1 = time.split1;
              }
              
              const sector2 = time.split2 - time.split1;
              if (sector2 < bestSector2) {
                bestSector2 = sector2;
              }
              
              const sector3 = time.time - time.split2;
              if (sector3 < bestSector3) {
                bestSector3 = sector3;
              }
            }
          }
        });
      });
    });

    return {
      singleLap: bestTime !== Infinity ? {
        bestTime,
        bestSector1,
        bestSector2,
        bestSector3,
        eventName: bestEventName,
        date: bestDate
      } : null,
      twoLap: twoLapBestTime !== Infinity ? {
        bestTime: twoLapBestTime,
        bestSector1: twoLapBestSector1,
        bestSector2: twoLapBestSector2,
        bestSector3: twoLapBestSector3,
        eventName: twoLapBestEventName,
        date: twoLapBestDate,
        isTwoLap: true
      } : null
    };
  }, []);

  // Calculate personal bests when filtered events change
  useEffect(() => {
    const bests = calculatePersonalBests(filteredEvents);
    setPersonalBest(bests.singleLap);
    setTwoLapPersonalBest(bests.twoLap);
  }, [filteredEvents, calculatePersonalBests]);

  useEffect(() => {
    const fetchAllEventData = async () => {
      try {
        setLoading(true);
        
        // Fetch the list of all events from site-metadata.json
        const response = await fetch('/site-metadata.json');
        if (!response.ok) {
          throw new Error('Failed to fetch events list');
        }
        
        const data = await response.json() as SiteMetadata;
        const eventDirectories = data.eventDirectories || [];
        
        // Fetch competitor data for each event from {dateStr}/api/simple/competitors.json
        const eventsData: EventData[] = [];
        
        for (const dateStr of eventDirectories) {
          try {
            const competitorResponse = await fetch(`/${dateStr}/api/simple/competitors.json`);
            if (!competitorResponse.ok) {
              console.warn(`No competitor data for ${dateStr}`);
              continue;
            }
            
            const competitors = await competitorResponse.json() as Competitor[];
            const eventName = data.metadataMap[dateStr]?.eventName || `Event ${dateStr}`;
            
            eventsData.push({
              date: dateStr,
              eventName,
              competitors
            });
          } catch (err) {
            console.warn(`Error fetching data for ${dateStr}:`, err);
          }
        }
        
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Failed to load event data');
        setLoading(false);
      }
    };
    
    fetchAllEventData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: number) => {
    return (time / 1000).toFixed(2);
  };

  return (
    <div className="personal-history-page">
      <Header />
      <main>
        <Typography 
          variant="h4" 
          component="h4" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            mb: { xs: 2, sm: 3 }
          }}
        >
          Personal Timing History
        </Typography>
        
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2 }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              backgroundColor: 'background.paper',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={isSearching}
            sx={{ 
              minWidth: { xs: '100%', sm: '120px' },
              height: { xs: '48px', sm: '56px' }
            }}
          >
            {isSearching ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
        
        {/* Debug Panel - Hidden by default */}
        <Box sx={{ mb: 2, display: 'none' }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setShowDebug(!showDebug)}
            startIcon={showDebug ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </Button>
          <Collapse in={showDebug}>
            <Paper sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              <Typography variant="body2">
                Search Term: "{searchTerm}"
                {debugInfo ? `\n\n${debugInfo}` : '\n\nNo debug info available'}
              </Typography>
            </Paper>
          </Collapse>
        </Box>
        
        <PersonalBestSummary personalBest={personalBest} eventCount={eventCounts.singleLap} />
        <PersonalBestSummary personalBest={twoLapPersonalBest} eventCount={eventCounts.twoLap} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'error.dark', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 2
          }}>
            <Typography>{error}</Typography>
          </Paper>
        ) : filteredEvents.length === 0 ? (
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 2
          }}>
            <Typography>No results found. Try a different search term.</Typography>
          </Paper>
        ) : (
          filteredEvents.map((event) => (
            <Paper 
              key={event.date} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3, 
                bgcolor: 'background.paper',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 'bold',
                    mb: 0
                  }}
                >
                  {event.eventName}
                </Typography>
                <Link 
                  href={`/${event.date}/display/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mr: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Full Results
                  </Typography>
                  <OpenInNewIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                </Link>
              </Box>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  mb: 2
                }}
              >
                {formatDate(event.date)}
              </Typography>
              
              <TableContainer sx={{ 
                overflowX: 'auto',
                '& .MuiTableCell-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 }
                }
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Best Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {event.competitors.map((competitor, index) => {
                      const bestTime = competitor.times
                        .filter(t => t.status === 0) // Only completed runs
                        .reduce((min, t) => Math.min(min, t.time), Infinity);
                      
                      return (
                        <TableRow key={`${competitor.firstName}-${competitor.lastName}-${index}`}>
                          <TableCell>
                            {competitor.firstName} {competitor.lastName}
                          </TableCell>
                          <TableCell>{competitor.number}</TableCell>
                          <TableCell>{competitor.vehicle}</TableCell>
                          <TableCell>{competitor.class}</TableCell>
                          <TableCell>
                            {bestTime !== Infinity ? formatTime(bestTime) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}; 