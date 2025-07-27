import { CircularProgress, Container, Typography } from '@mui/material'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

export function requestWrapper(
  requests: Record<string, UseQueryResult<unknown, unknown>>,
  ignoreLoadingKeys: string[] = []
) {
  for (const requestName in requests) {
    const request = requests[requestName]
    if (request.error) {
      return (
        <Container>
          <Typography variant="h4">Error</Typography>
          <Typography variant="h5">Technical details</Typography>
          <Typography variant="body1">
            {JSON.stringify(request.error, null, 2)}
          </Typography>
        </Container>
      )
    }

    if (
      typeof request.data === 'undefined' &&
      !ignoreLoadingKeys.includes(requestName)
    ) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <CircularProgress />
          <Typography variant="caption">
            Waiting on <code>{requestName}</code>
          </Typography>
        </div>
      )
    }
  }
}
