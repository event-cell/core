import { FC } from 'react'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table as MUITable,
  Chip,
  Typography,
  Box,
} from '@mui/material'

import { CarCrash, EmojiEvents } from '@mui/icons-material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const finishTimeThemeChip = createTheme({
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
    },
  },
})

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
              {row['times'].map(
                (run: {
                  run: number
                  status: number
                  time: number
                  split1: number
                  split2: number
                }) =>
                  run.status === 0 &&
                  run.time / 1000 < row['classRecord'] === true ? (
                    <TableCell key={run.run}>
                      <Typography component="div">
                        <Box sx={{ fontWeight: 'medium', textAlign: 'left' }}>
                          <Chip
                            label={run.time / 1000}
                            variant="filled"
                            color="warning"
                            size="small"
                            icon={<EmojiEvents />}
                          />
                        </Box>
                      </Typography>
                      <div>
                        {run.split1 / 1000} {run.split2 / 1000}
                      </div>
                    </TableCell>
                  ) : run.status === 0 ? (
                    <TableCell key={run.run}>
                      <Typography component="div">
                        <Box sx={{ fontWeight: 'medium', textAlign: 'left' }}>
                          {run.time / 1000}
                        </Box>
                      </Typography>
                      <div>
                        {run.split1 / 1000} {run.split2 / 1000}
                      </div>
                    </TableCell>
                  ) : run.status === 2 ? (
                    <TableCell key={run.run}>
                      <Chip
                        label="DNF"
                        variant="outlined"
                        color="error"
                        size="small"
                        icon={<CarCrash />}
                      />
                      <div>
                        {run.split1 / 1000} {run.split2 / 1000}
                      </div>
                    </TableCell>
                  ) : null
              )}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}
