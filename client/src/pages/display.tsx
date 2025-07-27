import React, { useEffect } from 'react'

import { DisplayCompetitorList, OnTrack } from 'ui-shared'

import { requestWrapper } from '../components/requestWrapper.js'
import { getDisplayNumber } from 'ui-shared/src/logic/displays.js'
import { Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getCompetitors, getCurrentCompetitor, getRunCount } from '../simpleApi.js'

export const DisplayPage = () => {
  const currentCompetitor = useQuery({
    queryKey: ['currentCompetitor'],
    queryFn: getCurrentCompetitor
  })
  const competitors = useQuery({
    queryKey: ['competitors'],
    queryFn: getCompetitors
  })
  const runCount = useQuery({
    queryKey: ['runCount'],
    queryFn: getRunCount
  })

  console.log(competitors)

  let displayRefresh = 15

  if (window.location.pathname === '/display/4') {
    displayRefresh = 5
  }

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await Promise.all([
        currentCompetitor.refetch(),
        competitors.refetch(),
        runCount.refetch(),
      ])
    }, 1000 * displayRefresh)
    return () => clearTimeout(timeout)
  }, [currentCompetitor, competitors, runCount])

  const requestErrors = requestWrapper(
    { currentCompetitor, allRuns: competitors, runCount },
    ['currentCompetitor']
  )
  if (requestErrors) return requestErrors

  if (!competitors.data) {
    console.warn('Missing competitors data')
    return null
  }

  const currentDisplayNumber = getDisplayNumber()
  const shouldDisplayCompetitorList =
    currentDisplayNumber === 0 || currentDisplayNumber === 4

  // For timing.sdmahillclimb.com.au, if runCount is 0, set it to 1 to ensure competitor list is displayed
  const effectiveRunCount = window.location.hostname === 'timing.sdmahillclimb.com.au' && runCount.data === 0 ? 1 : (runCount.data || 1)

  return (
    <Container>
      {competitors.data && runCount.data && (
        <DisplayCompetitorList
          competitors={competitors.data}
          runCount={effectiveRunCount}
        />
      )}

      {shouldDisplayCompetitorList && currentCompetitor.data && competitors.data && (
        <OnTrack
          currentCompetitorId={currentCompetitor.data}
          competitors={competitors.data}
        />
      )}
    </Container>
  )
}
