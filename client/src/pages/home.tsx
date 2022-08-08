import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'

import { trpc } from '../App'
import { ResultsTable } from '../components/table'
import { Timer } from '@mui/icons-material'

export const Home = () => {
  const rows = trpc.useQuery(['competitors.list'])
  const runCount = trpc.useQuery(['runs.count'])

  let classes: string[] = []

  if (rows.error) {
    return (
      <Container>
        <Typography variant="h4">Error</Typography>
        <Typography variant="body1">{rows.error.message}</Typography>
        <Typography variant="h5">Technical details</Typography>
        <Typography variant="body1">
          {JSON.stringify(rows.error.data, null, 2)}
        </Typography>
      </Container>
    )
  }

  if (!rows.data || !runCount.data) {
    // TODO: Center the loading spinner
    return <CircularProgress />
  }

  for (const row of rows.data || []) {
    if (classes.includes(row.class)) continue
    classes.push(row.class)
  }

  const classesList = classes.map((eventClass) => ({
    eventClass,
    drivers: rows.data.filter((data) => data.class === eventClass),
  }))

  return (
    <Container>
      {classesList.map((eventClass) => (
        <div key={eventClass.eventClass}>
          <Typography component="div">
            <Box fontWeight="fontWeightMedium" display="inline" lineHeight="3">
              {eventClass.eventClass}
            </Box>
          </Typography>
          <Chip
            label={'Class Record: ' + eventClass.drivers[0].classRecord}
            variant="outlined"
            color="info"
            size="medium"
            icon={<Timer />}
          />
          <p />
          <ResultsTable
            data={eventClass.drivers}
            keyKey={'number'}
            runCount={runCount.data}
          />
        </div>
      ))}
    </Container>
  )
}
