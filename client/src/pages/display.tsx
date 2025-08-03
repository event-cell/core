import React, { useEffect, useCallback } from 'react'

import { DisplayCompetitorList, MainDisplay, OnTrack, getDisplayNumber, DisplayFooter } from 'ui-shared'

import { requestWrapper } from '../components/requestWrapper.js'
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

  // Create a stable refetch function with error handling
  const refetchAll = useCallback(async () => {
    try {
      await Promise.all([
        currentCompetitor.refetch(),
        competitors.refetch(),
        runCount.refetch(),
      ])
    } catch (error) {
      console.error('Refetch failed:', error)
    }
  }, [currentCompetitor.refetch, competitors.refetch, runCount.refetch])

  useEffect(() => {
    const interval = setInterval(refetchAll, 1000 * displayRefresh)
    return () => clearInterval(interval)
  }, [refetchAll, displayRefresh])

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
  const isMainDisplay = window.location.pathname === '/display' || window.location.pathname === '/live-timing/display/'
  const shouldDisplayOnTrack =
    currentDisplayNumber === 0 || currentDisplayNumber === 4

  // For timing.sdmahillclimb.com.au, if runCount is 0, set it to 1 to ensure competitor list is displayed
  const effectiveRunCount = window.location.hostname === 'timing.sdmahillclimb.com.au' && runCount.data === 0 ? 1 : (runCount.data || 1)

  return (
    <Container>
      {competitors.data && runCount.data && (
        isMainDisplay ? (
          <MainDisplay
            competitors={competitors.data}
            runCount={effectiveRunCount}
            currentCompetitor={currentCompetitor.data}
          />
        ) : (
          <DisplayCompetitorList
            competitors={competitors.data}
            runCount={effectiveRunCount}
            currentCompetitor={currentCompetitor.data}
          />
        )
      )}
    </Container>
  )
}
