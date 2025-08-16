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

  let displayRefresh = 15

  if (window.location.pathname === '/display/4') {
    displayRefresh = 5
  }

  // Log refresh configuration on startup
  useEffect(() => {
    const displayNum = getDisplayNumber() || 'main'
    console.log(`🚀 [STARTUP] Display ${displayNum} refresh configuration:`)
    console.log(`   - Primary refresh: ${displayRefresh} seconds (React Query)`)
    console.log(`   - Secondary refresh: 300 seconds (5 minutes fallback)`)
    console.log(`   - Health check: 30 seconds (responsiveness monitoring)`)
    console.log(`   - Error-based refresh: enabled (automatic error recovery)`)
  }, [displayRefresh])

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
  }, [refetchAll, displayRefresh])

  // Secondary refresh: Fallback full page refresh every 5 minutes
  useEffect(() => {
    const fallbackInterval = setInterval(() => {
      console.log(`🔄 [SECONDARY] Fallback refresh - Display ${getDisplayNumber() || 'main'} (5-minute interval)`)
      window.location.reload()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(fallbackInterval)
  }, [])

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

  // Health check: Refresh if app becomes unresponsive (no activity for 2 minutes)
  useEffect(() => {
    let lastActivity = Date.now()

    const checkHealth = () => {
      const now = Date.now()
      if (now - lastActivity > 2 * 60 * 1000) { // 2 minutes of inactivity
        console.log(`🔄 [HEALTH] Responsiveness refresh - Display ${getDisplayNumber() || 'main'} (No activity for 2+ minutes)`)
        window.location.reload()
      }
    }

    const updateActivity = () => {
      lastActivity = Date.now()
    }

    // Update activity on user interaction
    window.addEventListener('click', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('mousemove', updateActivity)

    // Check health every 30 seconds
    const healthInterval = setInterval(checkHealth, 30 * 1000)

    return () => {
      clearInterval(healthInterval)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('mousemove', updateActivity)
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
