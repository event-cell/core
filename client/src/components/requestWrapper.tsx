import { CircularProgress, Container, Typography } from '@mui/material'
import { TRPCClientErrorLike } from '@trpc/client'
import { UseQueryResult } from 'react-query'
import React from 'react'

export function requestWrapper(
  requests: Record<string, UseQueryResult<unknown, TRPCClientErrorLike<never>>>,
  ignoreLoadingKeys: string[] = []
) {
  for (const requestName in requests) {
    const request = requests[requestName]
    if (request.error) {
      return (
        <Container>
          <Typography variant="h4">Error</Typography>
          <Typography variant="body1">{request.error.message}</Typography>
          <Typography variant="h5">Technical details</Typography>
          <Typography variant="body1">
            {JSON.stringify(request.error.data, null, 2)}
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
