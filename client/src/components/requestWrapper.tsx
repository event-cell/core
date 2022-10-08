import { CircularProgress, Container, Typography } from '@mui/material'
import { TRPCClientErrorLike } from '@trpc/client'
import { UseQueryResult } from 'react-query'
import React from 'react'

export function requestWrapper(
  ...requests: UseQueryResult<unknown, TRPCClientErrorLike<any>>[]
) {
  for (const request of requests) {
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

    if (typeof request.data === 'undefined') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </div>
      )
    }
  }
}
