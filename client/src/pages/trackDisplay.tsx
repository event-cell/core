import { Box, Container, Typography } from '@mui/material';
import CarCrash from '@mui/icons-material/CarCrash';
import React, { useEffect, useCallback, useMemo } from 'react';

import { trpc } from '../App.js';
import { requestWrapper } from '../components/requestWrapper.js';
import { refreshConfigService } from 'ui-shared';

import {
  calculateTimes,
  getClassBestSectors,
  getPersonalBestSectors,
  getSectorColors,
} from 'ui-shared';
import { TimeInfo } from '../../../server/src/router/objects.js';

import type { Competitor } from '../../../server/src/router/objects.js';

// Fixed height distribution for 720px total height
const HEIGHTS = {
  TOP_MARGIN: 40,      // TV overscan
  SECTOR_INDICATORS: 40,
  SECTOR_TIMES: 120,
  FINISH_INDICATOR: 60,
  FINISH_TIME: 240,
  COMPETITOR_INFO: 80,
  BOTTOM_MARGIN: 20
};

// Fixed font sizes
const FONT_SIZES = {
  SECTOR_TIMES: 110,
  FINISH_TIME: 280,
};

// Common styling patterns
const commonStyles = {
  borderRadius: '4px',
  fontFamily: 'Roboto',
  fontWeight: 700,
  textAlign: 'center' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};



function getLatestSector({
  finish,
  sector1,
  sector2,
  sector3,
}: {
  finish: number;
  sector1: number;
  sector2: number;
  sector3: number;
}): string {
  const formatNumber = (num: number) => (num / 1000).toFixed(2);
  if (finish > 0) return formatNumber(finish);
  if (sector3 > 0) return formatNumber(sector3);
  if (sector2 > 0) return formatNumber(sector2);
  if (sector1 > 0) return formatNumber(sector1);
  return '';
}

const RenderTime = ({
  times,
  time,
}: {
  times: {
    sector1: number;
    sector2: number;
    sector3: number;
    finish: number;
  };
  time: TimeInfo | undefined;
}) => {
  if (typeof time === 'undefined') return null;

  if (time.status === 2) {
    return (
      <Box sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CarCrash color="error" />
        DNF
      </Box>
    );
  }

  if (time.status === 3) {
    return (
      <Box sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CarCrash color="error" />
        DSQ
      </Box>
    );
  }

  return <>{getLatestSector(times)}</>;
};



export const TrackDisplay = () => {
  // ✅ Converted to v10 tRPC usage
  const currentCompetitorId = trpc.currentcompetitor.number.useQuery(undefined);
  const competitors = trpc.competitors.list.useQuery(undefined);

  // Dynamic refresh intervals from configuration
  const [trackDisplayRefresh, setTrackDisplayRefresh] = React.useState(2)
  const [fallbackInterval, setFallbackInterval] = React.useState(300)

  // Error refresh cooldown
  const [lastErrorRefresh, setLastErrorRefresh] = React.useState(0)
  const ERROR_REFRESH_COOLDOWN = 15000 // 15 seconds in milliseconds

  // Load refresh configuration on startup
  useEffect(() => {
    const loadRefreshConfig = async () => {
      try {
        const primaryInterval = await refreshConfigService.getRefreshIntervalForRoute('/trackdisplay')
        const fallback = await refreshConfigService.getFallbackInterval()

        setTrackDisplayRefresh(primaryInterval)
        setFallbackInterval(fallback)

        console.log(`🚀 [STARTUP] TrackDisplay refresh configuration:`)
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
      console.log(`🔄 [PRIMARY] React Query refetch - TrackDisplay`)
      await Promise.all([
        currentCompetitorId.refetch(),
        competitors.refetch(),
      ])
      console.log(`✅ [PRIMARY] React Query refetch completed successfully`)
    } catch (error) {
      console.error('❌ [PRIMARY] Refetch failed:', error)
      // Check cooldown before triggering error refresh
      const now = Date.now()
      if (now - lastErrorRefresh > ERROR_REFRESH_COOLDOWN) {
        console.log('🔄 [ERROR-FALLBACK] Refetch failed, performing full page refresh')
        setLastErrorRefresh(now)
        window.location.reload()
      } else {
        console.log(`⏳ [ERROR-COOLDOWN] Skipping error refresh, cooldown active (${Math.ceil((ERROR_REFRESH_COOLDOWN - (now - lastErrorRefresh)) / 1000)}s remaining)`)
      }
    }
  }, [currentCompetitorId.refetch, competitors.refetch, lastErrorRefresh])

  // Primary refresh: React Query refetch at track display intervals
  useEffect(() => {
    const interval = setInterval(refetchAll, 1000 * trackDisplayRefresh);
    return () => clearInterval(interval);
  }, [refetchAll, trackDisplayRefresh, fallbackInterval]);

  // Secondary refresh: Fallback full page refresh
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`🔄 [SECONDARY] Fallback refresh - TrackDisplay (${Math.round(fallbackInterval / 60)}-minute interval)`)
      window.location.reload()
    }, 1000 * fallbackInterval) // Use configured interval

    return () => clearInterval(interval)
  }, [fallbackInterval])

  // Tertiary refresh: Error-based refresh for unhandled errors
  useEffect(() => {
    const handleError = () => {
      const now = Date.now()
      if (now - lastErrorRefresh > ERROR_REFRESH_COOLDOWN) {
        console.log(`🔄 [TERTIARY] Error-based refresh - TrackDisplay (JavaScript error detected)`)
        setLastErrorRefresh(now)
        window.location.reload()
      } else {
        console.log(`⏳ [ERROR-COOLDOWN] Skipping error refresh, cooldown active (${Math.ceil((ERROR_REFRESH_COOLDOWN - (now - lastErrorRefresh)) / 1000)}s remaining)`)
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const now = Date.now()
      if (now - lastErrorRefresh > ERROR_REFRESH_COOLDOWN) {
        console.log(`🔄 [TERTIARY] Error-based refresh - TrackDisplay (Unhandled promise rejection)`)
        event.preventDefault() // Prevent default browser error handling
        setLastErrorRefresh(now)
        window.location.reload()
      } else {
        console.log(`⏳ [ERROR-COOLDOWN] Skipping error refresh, cooldown active (${Math.ceil((ERROR_REFRESH_COOLDOWN - (now - lastErrorRefresh)) / 1000)}s remaining)`)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [lastErrorRefresh])

  const requestErrors = requestWrapper({
    currentCompetitor: currentCompetitorId,
    allRuns: competitors,
  });
  if (requestErrors) return requestErrors;
  if (!currentCompetitorId.data || !competitors.data) {
    console.warn('A function was called that should not be called');
    return null;
  }

  const currentCompetitor = (competitors.data as Competitor[]).find(
    (a) => a.number === currentCompetitorId.data
  );

  // Add validation for currentCompetitor
  if (!currentCompetitor) {
    console.warn('Current competitor not found');
    return (
      <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No competitor data available</Typography>
      </Container>
    );
  }

  const idx = currentCompetitor.times.length - 1;
  const splits = currentCompetitor.times[idx];

  // Add validation for splits data
  if (!splits) {
    console.warn('No splits data available for current competitor');
    return (
      <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No timing data available</Typography>
      </Container>
    );
  }

  const normalizedCompetitors = competitors.data.map((c) => ({
    ...c,
    times: c.times.map((t) => t ?? undefined), // Convert `null` to `undefined`
  }));

  const classBest = getClassBestSectors(
    currentCompetitor.classIndex,
    normalizedCompetitors
  );
  const personalBest = getPersonalBestSectors(currentCompetitor);
  const times = calculateTimes(splits);

  const {
    first: sector1Colour,
    second: sector2Colour,
    third: sector3Colour,
    finish: finishPartial,
  } = getSectorColors(classBest, personalBest, times);

  const { sector1, sector2, sector3 } = times;

  const finishColor = [sector1Colour, sector2Colour, sector3Colour].reduce(
    (accum, current) => (current !== 'background.default' ? current : accum),
    finishPartial
  );

  // Calculate competitor text (name only)
  const competitorText = `${currentCompetitor.firstName} ${currentCompetitor.lastName}`.toUpperCase();

  // CSS Grid layout with fixed dimensions
  const layout = {
    display: 'grid',
    gridTemplateRows: `${HEIGHTS.TOP_MARGIN}px ${HEIGHTS.SECTOR_INDICATORS}px ${HEIGHTS.SECTOR_TIMES}px ${HEIGHTS.FINISH_INDICATOR}px ${HEIGHTS.FINISH_TIME}px 20px ${HEIGHTS.COMPETITOR_INFO}px ${HEIGHTS.BOTTOM_MARGIN}px`,
    gridTemplateColumns: '2fr 1fr', // Two columns: finish time (wider) and club name (narrower)
    height: '100vh',
    width: '100%',
    gap: '8px',
    padding: '8px',
  };

  return (
    <Container maxWidth={false} sx={layout}>
      {/* Top margin for TV overscan */}
      <Box sx={{ gridColumn: '1 / -1' }} />

      {/* Sector indicators */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Box sx={{ display: 'flex', gap: '8px', height: HEIGHTS.SECTOR_INDICATORS }}>
          <Box sx={{ ...commonStyles, bgcolor: sector1Colour, flex: 1 }} />
          <Box sx={{ ...commonStyles, bgcolor: sector2Colour, flex: 1 }} />
          <Box sx={{ ...commonStyles, bgcolor: sector3Colour, flex: 1 }} />
        </Box>
      </Box>

      {/* Sector times */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Box sx={{ display: 'flex', gap: '8px', height: HEIGHTS.SECTOR_TIMES }}>
          <Box sx={{ ...commonStyles, bgcolor: 'background.default', flex: 1, fontSize: FONT_SIZES.SECTOR_TIMES }}>
            {sector1 > 0 ? (sector1 / 1000).toFixed(2) : ''}
          </Box>
          <Box sx={{ ...commonStyles, bgcolor: 'background.default', flex: 1, fontSize: FONT_SIZES.SECTOR_TIMES }}>
            {sector2 > 0 ? (sector2 / 1000).toFixed(2) : ''}
          </Box>
          <Box sx={{ ...commonStyles, bgcolor: 'background.default', flex: 1, fontSize: FONT_SIZES.SECTOR_TIMES }}>
            {sector3 > 0 ? (sector3 / 1000).toFixed(2) : ''}
          </Box>
        </Box>
      </Box>

      {/* Finish indicator */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Box sx={{ ...commonStyles, bgcolor: finishColor, height: HEIGHTS.FINISH_INDICATOR }} />
      </Box>

      {/* Finish time - left side */}
      <Box sx={{ gridColumn: '1 / 2' }}>
        <Box sx={{
          ...commonStyles,
          bgcolor: 'background.default',
          height: HEIGHTS.FINISH_TIME,
          fontSize: FONT_SIZES.FINISH_TIME,
          justifyContent: 'flex-start', // Left justify
          paddingLeft: '20px'
        }}>
          <RenderTime times={calculateTimes(splits)} time={splits} />
        </Box>
      </Box>

      {/* Club name - right side */}
      <Box sx={{ gridColumn: '2 / 3' }}>
        <Box sx={{
          ...commonStyles,
          bgcolor: 'background.default',
          height: HEIGHTS.FINISH_TIME,
          justifyContent: 'center' // Center the club name
        }}>
          <Typography
            sx={{
              fontSize: 'clamp(96px, 6vw, 128px)', // Responsive font scaling for club name
              fontWeight: '700',
              fontFamily: 'Roboto',
              textAlign: 'center',
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {currentCompetitor.club ? currentCompetitor.club.toUpperCase() : ''}
          </Typography>
        </Box>
      </Box>

      {/* 20px spacer between finish time and competitor name */}
      <Box sx={{ gridColumn: '1 / -1' }} />

      {/* Competitor info */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Box sx={{ ...commonStyles, bgcolor: 'background.default', height: HEIGHTS.COMPETITOR_INFO }}>
          <Typography
            sx={{
              fontSize: 'clamp(64px, 8vw, 96px)', // Responsive font size: min 24px, max 72px, scales with viewport
              fontWeight: '700',
              fontFamily: 'Roboto',
              textAlign: 'center',
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', // Single line display
              maxWidth: '100%',
            }}
          >
            {competitorText}
          </Typography>
        </Box>
      </Box>

      {/* Bottom margin */}
      <Box sx={{ gridColumn: '1 / -1' }} />
    </Container>
  );
};
