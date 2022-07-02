import { FC } from 'react'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table as MUITable,
  ListItemText,
} from '@mui/material'

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
              <TableCell>
                {row['number']} {row['special']}
              </TableCell>
              <TableCell>
                {row['firstName']} {row['lastName']}
              </TableCell>
              <TableCell>{row['vehicle']}</TableCell>
              {row['times'].map(
                (run: {
                  run: number
                  time: number
                  split1: number
                  split2: number
                }) => (
                  <TableCell key={run.run}>
                    <div>{run.time / 1000}</div>
                    <div>
                      {run.split1 / 1000} {run.split2 / 1000}
                    </div>
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

//     <TableContainer component={Paper}>
//     <MUITable sx={{ minWidth: 650 }} size="small">
//     <TableHead>
//     <TableRow>
//     {header.map(({ headerName }) => (
//           <TableCell>{headerName}</TableCell>
//       ))}
// </TableRow>
// </TableHead>
// <TableBody>
//   {data.map((row) => (
//       <TableRow key={row[keyKey]}>
//         {header.map(({ field }) => (
//             <TableCell>{row[field]}</TableCell>
//         ))}
//       </TableRow>
//   ))}
// </TableBody>
// </MUITable>
// </TableContainer>
