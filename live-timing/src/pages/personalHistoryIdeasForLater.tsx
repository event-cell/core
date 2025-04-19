import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getCompetitors } from '../../simpleApi'
import { requestWrapper } from '../../components/requestWrapper'
import { getPersonalBestSectors, getPersonalBestTotal } from 'ui-shared'
import type { CompetitorList } from 'server/src/router/objects'

export const PersonalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(null)
  
  const competitors = useQuery({
    queryKey: ['competitors'],
    queryFn: getCompetitors
  })

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await competitors.refetch()
    }, 1000 * 30) // Refresh every 30 seconds
    return () => clearTimeout(timeout)
  }, [competitors])

  const requestErrors = requestWrapper(
    { competitors },
    ['competitors']
  )
  if (requestErrors) return requestErrors

  if (!competitors.data) {
    console.warn('Missing competitors data')
    return null
  }

  // Filter competitors based on search term
  const filteredCompetitors = competitors.data.filter(competitor => {
    const fullName = `${competitor.firstName} ${competitor.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  // Find the selected competitor
  const competitor = selectedCompetitor 
    ? competitors.data.find(c => c.number === selectedCompetitor) 
    : null

  // Get personal best data for the selected competitor
  const personalBest = competitor ? getPersonalBestSectors(competitor) : null
  const personalBestTotal = competitor ? getPersonalBestTotal(competitor) : null

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personal History
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Best Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompetitors.map((competitor) => {
                  // Find the best time for this competitor
                  const validTimes = competitor.times.filter(time => time && time.time > 0)
                  const bestTime = validTimes.length > 0 
                    ? Math.min(...validTimes.map(time => time?.time || 0)) / 1000 
                    : null
                  
                  return (
                    <TableRow 
                      key={competitor.number}
                      hover
                      onClick={() => setSelectedCompetitor(competitor.number)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{competitor.number}</TableCell>
                      <TableCell>{competitor.firstName} {competitor.lastName}</TableCell>
                      <TableCell>{competitor.class}</TableCell>
                      <TableCell>{competitor.vehicle}</TableCell>
                      <TableCell>{bestTime ? bestTime.toFixed(2) : 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCompetitor(competitor.number)
                          }}
                        >
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {selectedCompetitor && competitor && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {competitor.firstName} {competitor.lastName} - {competitor.vehicle}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Class: {competitor.class} (Number: {competitor.number})
            </Typography>
            
            {personalBest && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personal Best Sectors
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sector</TableCell>
                        <TableCell>Time (s)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sector 1</TableCell>
                        <TableCell>{(personalBest.bestSector1 / 1000).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sector 2</TableCell>
                        <TableCell>{(personalBest.bestSector2 / 1000).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sector 3</TableCell>
                        <TableCell>{(personalBest.bestSector3 / 1000).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Finish</TableCell>
                        <TableCell>{(personalBest.bestFinish / 1000).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Run History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Run</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time (s)</TableCell>
                      <TableCell>Sector 1 (s)</TableCell>
                      <TableCell>Sector 2 (s)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {competitor.times.map((time, index) => (
                      <TableRow key={index}>
                        <TableCell>{time?.run || index + 1}</TableCell>
                        <TableCell>
                          {time?.status === 0 ? 'Valid' : 
                           time?.status === 1 ? 'DNF' : 
                           time?.status === 2 ? 'DNS' : 
                           time?.status === 3 ? 'Off Course' : 'Unknown'}
                        </TableCell>
                        <TableCell>{time?.time ? (time.time / 1000).toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{time?.split1 ? (time.split1 / 1000).toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{time?.split2 ? (time.split2 / 1000).toFixed(2) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  )
} 