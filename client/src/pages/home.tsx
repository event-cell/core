import { CircularProgress, Container, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { trpc } from '../App'

const helloColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'text', headerName: 'Text' },
  { field: 'language', headerName: 'Language' },
]

export const Home = () => {
  const rows = trpc.useQuery(['list'])

  return (
    <Container>
      <Typography variant="h1">Home</Typography>

      {rows.data ? (
        <div style={{ display: 'flex', height: '40vh' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid rows={rows.data} columns={helloColumns} />
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </Container>
  )
}
