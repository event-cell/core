import {
  CircularProgress,
  Container,
  Divider,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'

import { trpc } from '../App'
import { ResultsTable } from '../components/table'

export const Home = () => {
  const rows = trpc.useQuery(['competitors.list'])
  const runCount = trpc.useQuery(['runs.count'])

  let classes: string[] = []

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
          <ListItem>
            <ListItemText
              primary={eventClass.eventClass}
              secondary={`Class Record: ${eventClass.drivers[0].classRecord}`}
            />
          </ListItem>
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
