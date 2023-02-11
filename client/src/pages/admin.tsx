import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import React from 'react'
import { trpc, useTrpcClient } from '../App'

import { requestWrapper } from '../components/requestWrapper'

const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

async function downloadFile(file: File) {
  const data = await toBase64(file)
  if (typeof data !== 'string')
    throw new Error(`Could not convert file into a valid data string`)

  const element = document.createElement('a')
  element.setAttribute('href', data)
  element.setAttribute('download', file.name)

  element.style.display = 'none'
  document.body.append(element)
  console.log(element)
  element.click()
  element.remove()
}

export const Admin = () => {
  const trpcClient = useTrpcClient()

  const config = trpc.useQuery(['config.get'])
  const setConfig = trpc.useMutation(['config.set'])

  const loading = setConfig.status === 'loading'

  const requestErrors = requestWrapper(config)
  if (requestErrors) return requestErrors
  if (!config.data) return null // This will never be called, but it is needed to make typescript happy

  const buttonSx = {
    ...(setConfig.status === 'success' && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
    ...(setConfig.status === 'error' && {
      bgcolor: red[500],
      '&:hover': {
        bgcolor: red[700],
      },
    }),
  }

  return (
    <Container>
      <h1>TODO: Protect this page auth of some kind</h1>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          required
          fullWidth
          label="Event ID"
          defaultValue={config.data.eventId}
          onChange={(e) => {
            setConfig.reset() // Reset the mutate status, removes the green button
            setNewConfig({ ...newConfig, eventId: e.target.value })
          }}
        />
        <TextField
          required
          fullWidth
          label="Event Name"
          defaultValue={config.data.eventName}
          onChange={(e) => {
            setConfig.reset() // Reset the mutate status, removes the green button
            setNewConfig({ ...newConfig, eventName: e.target.value })
          }}
        />
      </Box>

      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={loading}
          sx={buttonSx}
          onClick={() => {
            setConfig.mutate(newConfig)
          }}
        >
          Save
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={loading}
          sx={buttonSx}
          onClick={async () => {
            const data = await trpcClient.query('endofdayresults.generate')
            const mediaType =
              'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
            window.location.href = `${mediaType}${data.xlsx}`
            // const file = new File([fileBlob], 'endofdayresults.xlsx')
            // await downloadFile(file)
          }}
        >
          End of Day Results
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Container>
  )
}
