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
import Grid2 from '@mui/material/Unstable_Grid2'
import { Cancel, CarCrash, MeetingRoom } from '@mui/icons-material'

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
}) => {
  let finishTime
  let sector2
  let sector1
  let launch

  let mainFontSize = '0.8rem'
  let mainWidth = 65

  finishTime = (run.time / 1000).toFixed(2)
  sector2 = ((run.time - run.split2) / 1000).toFixed(2)
  sector1 = ((run.split2 - run.split1) / 1000).toFixed(2)
  launch = (run.split1 / 1000).toFixed(2)

  // if run did not start
  if (run.status === 1) {
    return (
      <Grid2
        container
        spacing={0.25}
        sx={{
          fontSize: mainFontSize,
          width: mainWidth,
        }}
      >
        <Grid2 xs={12} display="flex" justifyContent="left" alignItems="center">
          <Chip
            label="DNS"
            variant="outlined"
            color="info"
            size="small"
            icon={<MeetingRoom />}
          />
        </Grid2>
      </Grid2>
    )
  }

  // if run DNF
  if (run.status === 2) {
    return (
      <Grid2
        container
        spacing={0.25}
        sx={{
          fontSize: mainFontSize,
          width: mainWidth,
        }}
      >
        <Grid2
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Chip
            label="DNF"
            variant="outlined"
            color="error"
            size="small"
            icon={<CarCrash />}
          />
        </Grid2>
        <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
          {launch}
        </Grid2>
        <Grid2 xs={6} display="flex" justifyContent="right" alignItems="center">
          {sector1}
        </Grid2>
      </Grid2>
    )
  }

  // if run disqualified
  if (run.status === 3) {
    return (
      <Grid2
        container
        spacing={0.25}
        sx={{
          fontSize: mainFontSize,
          width: mainWidth,
        }}
      >
        <Grid2 xs={12} display="flex" justifyContent="left" alignItems="center">
          <Chip
            label="DSQ"
            variant="outlined"
            color="error"
            size="small"
            icon={<Cancel />}
          />
        </Grid2>
      </Grid2>
    )
  }

  if (run.status === 0 && run.time / 1000 < classRecord) {
    return (
      <Grid2
        container
        spacing={0.25}
        sx={{
          fontSize: mainFontSize,
          width: mainWidth,
        }}
      >
        <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
          {sector2}
        </Grid2>
        <Grid2
          xs={6}
          display="flex"
          justifyContent="right"
          alignItems="center"
          border="1px"
          color="gold"
          sx={{ fontSize: '0.9rem', fontWeight: 700 }}
        >
          {finishTime}
        </Grid2>
        <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
          {launch}
        </Grid2>
        <Grid2 xs={6} display="flex" justifyContent="right" alignItems="center">
          {sector1}
        </Grid2>
      </Grid2>
    )
  }

  return (
    <Grid2
      container
      spacing={0.25}
      sx={{
        fontSize: mainFontSize,
        width: mainWidth,
      }}
    >
      <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
        {sector2}
      </Grid2>
      <Grid2
        xs={6}
        display="flex"
        justifyContent="right"
        alignItems="center"
        border="1px"
        color="primary.dark"
        sx={{ fontSize: '0.9rem', fontWeight: 700 }}
      >
        {finishTime}
      </Grid2>
      <Grid2 xs={6} display="flex" justifyContent="left" alignItems="center">
        {launch}
      </Grid2>
      <Grid2 xs={6} display="flex" justifyContent="right" alignItems="center">
        {sector1}
      </Grid2>
    </Grid2>
  )
}

export const ResultsTable: FC<{
  data: Record<string, string | number | any>[]
  keyKey: string
  runCount: number
}> = ({ data, keyKey, runCount }) => {
  return (
    <TableContainer component={Paper}>
      <MUITable sx={{ minWidth: 640 }} size="small">
        <TableHead>
          {/*<TableRow sx={{ height: 10, m: 0, p: 0 }}>*/}
          {/*  <TableCell width={200} sx={{ fontSize: '0.8rem' }}>*/}
          {/*    Competitor*/}
          {/*  </TableCell>*/}
          {/*  {Array.apply(null, Array(runCount)).map((_, index) => (*/}
          {/*    <TableCell key={index} sx={{ fontSize: '0.8rem' }}>*/}
          {/*      Run {index + 1}*/}
          {/*    </TableCell>*/}
          {/*  ))}*/}
          {/*</TableRow>*/}
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row[keyKey]}>
              <TableCell width={200}>
                <Box
                  sx={{
                    display: 'grid',
                    gridAutoColumns: '1fr',
                    gap: 0.5,
                    ml: -1,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      textAlign: 'center',
                      gridRow: '1',
                      gridColumn: '1',
                    }}
                  >
                    {row['number']}
                  </Box>
                  <Box
                    sx={{
                      textAlign: 'left',
                      fontSize: '1rem',
                      gridRow: '1',
                      gridColumn: '2/5',
                    }}
                  >
                    {row['lastName']} {row['firstName']}
                  </Box>
                  {row['special'] ? (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        color: 'primary.dark',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        gridRow: '2',
                        gridColumn: '1',
                      }}
                    >
                      {row['special']}
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      gridRow: '2',
                      gridColumn: '2/5',
                    }}
                  >
                    {row['vehicle']}
                  </Box>
                </Box>
              </TableCell>

              {ensureData(
                row['times'].filter(
                  (time: RunTime) => time.time !== 0 || time.status !== 0
                )
              ).map((run, index) =>
                !run ? (
                  <TableCell key={index}></TableCell>
                ) : (
                  <TableCell key={index}>
                    <TimeTag run={run} classRecord={row.classRecord} />
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
