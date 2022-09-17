import { FC } from 'react'
import {
  Box,
  Chip,
  Paper,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { Cancel, CarCrash, EmojiEvents, MeetingRoom } from '@mui/icons-material'

type Optional<T> = T | undefined
type RunTime = {
  run: number
  status: number
  time: number
  split1: number
  split2: number
}

function ensureData(data: RunTime[]): Optional<RunTime>[] {
  let max_run = Math.max(...data.map((data) => data.run), 0)

  if (max_run <= 0) return []

  return Array.apply(null, Array(max_run)).map((_, index) =>
    data.find((data) => data.run === index + 1)
  )
}

const TimeTag: FC<{ run: RunTime; classRecord: number }> = ({
  run,
  classRecord,
}) =>
  run.status === 0 && run.time / 1000 < classRecord ? (
    <Chip
      label={(run.time / 1000).toFixed(2)}
      variant="filled"
      color="warning"
      size="small"
      icon={<EmojiEvents />}
    />
  ) : run.status === 0 ? (
    <Box sx={{ fontWeight: 'medium', textAlign: 'left' }}>
      {(run.time / 1000).toFixed(2)}
    </Box>
  ) : run.status === 1 ? (
    <Chip
      label="DNS"
      variant="outlined"
      color="info"
      size="small"
      icon={<MeetingRoom />}
    />
  ) : run.status === 2 ? (
    <Chip
      label="DNF"
      variant="outlined"
      color="error"
      size="small"
      icon={<CarCrash />}
    />
  ) : run.status === 3 ? (
    <Chip
      label="DSQ"
      variant="outlined"
      color="error"
      size="small"
      icon={<Cancel />}
    />
  ) : (
    <div>Unknown status {run.status}</div>
  )

export const ResultsTable: FC<{
  data: Record<string, string | number | any>[]
  keyKey: string
  runCount: number
}> = ({ data, keyKey, runCount }) => {
  return (
    <TableContainer component={Paper}>
      <MUITable sx={{ minWidth: 200 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell width={1}>Num</TableCell>
            <TableCell width={2}>Name</TableCell>
            <TableCell width={2}>Car</TableCell>
            {Array.apply(null, Array(runCount)).map((_, index) => (
              <TableCell key={index}>Run {index + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row[keyKey]}>
              <TableCell>{row['number']}</TableCell>
              <TableCell>
                {row['lastName']} {row['firstName']}
                {row['special'] ? (
                  <Chip
                    label={row['special']}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ) : null}
              </TableCell>
              <TableCell>{row['vehicle']}</TableCell>
              {ensureData(
                row['times'].filter(
                  (time: RunTime) => time.time !== 0 || time.status !== 0
                )
              ).map((run, index) =>
                !run ? (
                  <TableCell key={index}></TableCell>
                ) : (
                  <TableCell key={index}>
                    <Box sx={{ fontWeight: 'medium', textAlign: 'left' }}>
                      <TimeTag run={run} classRecord={row.classRecord} />
                    </Box>
                    {run.status !== 3 && run.status !== 1 && (
                      <Box>
                        {(run.split1 / 1000).toFixed(2)}{' '}
                        {(run.split2 / 1000).toFixed(2)}
                      </Box>
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}
