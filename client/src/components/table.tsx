import { FC } from 'react'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table as MUITable,
} from '@mui/material'

export const ResultsTable: FC<{
  data: Record<string, string | number>[]
  keyKey: string
}> = ({ data, keyKey }) => (
  <TableContainer component={Paper}>
    <MUITable sx={{ minWidth: 200 }} size="small">
      <TableHead>
        <TableRow>
          <TableCell width={1}>Num</TableCell>
          <TableCell width={2}>Name</TableCell>
          <TableCell width={2}>Car</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </MUITable>
  </TableContainer>
)

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
