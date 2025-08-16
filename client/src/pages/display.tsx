import React, { useEffect, useCallback } from 'react'

import { DisplayCompetitorList, MainDisplay, OnTrack, getDisplayNumber, DisplayFooter } from 'ui-shared'

import { requestWrapper } from '../components/requestWrapper.js'
import { Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getCompetitors, getCurrentCompetitor, getRunCount } from '../simpleApi.js'
import { refreshConfigService } from 'ui-shared'

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

  // Dynamic refresh intervals from configuration
  const [displayRefresh, setDisplayRefresh] = React.useState(15)
  const [fallbackInterval, setFallbackInterval] = React.useState(300)

  // Load refresh configuration on startup
  useEffect(() => {
    const loadRefreshConfig = async () => {
      try {
        const currentPath = window.location.pathname
        const primaryInterval = await refreshConfigService.getRefreshIntervalForRoute(currentPath)
        const fallback = await refreshConfigService.getFallbackInterval()

        setDisplayRefresh(primaryInterval)
        setFallbackInterval(fallback)

        console.log(`🚀 [STARTUP] Display ${getDisplayNumber() || 'main'} refresh configuration:`)
        console.log(`   - Primary refresh: ${primaryInterval} seconds (React Query)`)
        console.log(`   - Secondary refresh: ${fallback} seconds (${Math.round(fallback / 60)} minutes fallback)`)
        console.log(`   - Error-based refresh: enabled (automatic error recovery)`)
      } catch (error) {
        console.warn('Failed to load refresh configuration, using defaults:', error)
        // Keep default values if configuration fails to load
      }
    }

    loadRefreshConfig()
  }, [])

  // Create a stable refetch function with error handling
  const refetchAll = useCallback(async () => {
    try {
      console.log(`🔄 [PRIMARY] React Query refetch - Display ${getDisplayNumber() || 'main'}`)
      await Promise.all([
        currentCompetitor.refetch(),
        competitors.refetch(),
        runCount.refetch(),
      ])
      console.log(`✅ [PRIMARY] React Query refetch completed successfully`)
    } catch (error) {
      console.error('❌ [PRIMARY] Refetch failed:', error)
      // If refetch fails, trigger a full page refresh
      console.log('🔄 [ERROR-FALLBACK] Refetch failed, performing full page refresh')
      window.location.reload()
    }
  }, [currentCompetitor.refetch, competitors.refetch, runCount.refetch])

  // Primary refresh: React Query refetch at display-specific intervals
  useEffect(() => {
    const interval = setInterval(refetchAll, 1000 * displayRefresh)
    return () => clearInterval(interval)
  }, [refetchAll, displayRefresh, fallbackInterval])

  // Secondary refresh: Fallback full page refresh
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`🔄 [SECONDARY] Fallback refresh - Display ${getDisplayNumber() || 'main'} (${Math.round(fallbackInterval / 60)}-minute interval)`)
      window.location.reload()
    }, 1000 * fallbackInterval) // Use configured interval

    return () => clearInterval(interval)
  }, [fallbackInterval])

  // Tertiary refresh: Error-based refresh for unhandled errors
  useEffect(() => {
    const handleError = () => {
      console.log(`🔄 [TERTIARY] Error-based refresh - Display ${getDisplayNumber() || 'main'} (JavaScript error detected)`)
      window.location.reload()
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log(`🔄 [TERTIARY] Error-based refresh - Display ${getDisplayNumber() || 'main'} (Unhandled promise rejection)`)
      event.preventDefault() // Prevent default browser error handling
      window.location.reload()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])



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
