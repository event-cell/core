import { FC } from 'react'
import {
  Box,
  Paper,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { DNS, DNF, Disqualified, ClassRecord, Regular } from './table/index'

type RunTime = {
  run: number
  status: number
  time: number
  split1: number
  split2: number
}

function range(upperBound: number): number[] {
  const range = []

  for (let i = 0; i < upperBound; i++) {
    range.push(i)
  }

  return range
}

function ensureData(data: RunTime[]): (RunTime | undefined)[] {
  const max_run = Math.max(...data.map((data) => data.run), 0)

  if (max_run <= 0) return []

  const out = []

  for (let index = 0; index < max_run; index++) {
    out.push(data.find((data) => data.run === index + 1))
  }

  return out
}

const DataRowContents: FC<{ run: RunTime; classRecord: number }> = ({
  run,
  classRecord,
}) => {
  if (run.status === 1) return <DNS />
  if (run.status === 3) return <Disqualified />

  const sector1 = (run.split1 / 1000).toFixed(2)
  const sector2 = ((run.split2 - run.split1) / 1000).toFixed(2)

  if (run.status === 2) return <DNF launch={sector1} sector1={sector2} />

  const finishTime = (run.time / 1000).toFixed(2)
  const sector3 = ((run.time - run.split2) / 1000).toFixed(2)

  if (run.status === 0 && run.time / 1000 < classRecord)
    return (
      <ClassRecord
        launch={sector1}
        sector1={sector2}
        sector2={sector3}
        finishTime={finishTime}
      />
    )

  return (
    <Regular
      launch={sector1}
      sector1={sector2}
      sector2={sector3}
      finishTime={finishTime}
    />
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
          <TableRow sx={{ height: 10, m: 0, p: 0 }}>
            <TableCell width={200} sx={{ fontSize: '0.8rem' }}>
              Competitor
            </TableCell>
            {range(runCount).map((_, index) => (
              <TableCell key={index} sx={{ fontSize: '0.8rem' }}>
                Run {index + 1}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row[keyKey]}>
              <TableCell width={240}>
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
                    {row['firstName']} {row['lastName']}
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
                    <DataRowContents run={run} classRecord={row.classRecord} />
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
