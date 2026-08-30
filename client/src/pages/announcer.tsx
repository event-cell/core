// announcer.tsx

import React, { useEffect, useMemo, useCallback } from 'react';
import Timer from '@mui/icons-material/Timer';
import {
  Alert,
  Box,
  Chip,
  Container,
  Paper,
  styled,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { trpc } from '../App.js';
import { RenderInfo, CompetitorTable, TriSeriesPoints } from 'ui-shared';
import { requestWrapper } from '../components/requestWrapper.js';
import { refreshConfigService } from 'ui-shared';
import { CompetitorList } from '../../../server/src/router/objects.js';

import type { Competitor } from '../../../server/src/router/objects.js';

const PrimaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

const PrimaryPaperCenter = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const RenderClassList = ({
  classes,
  allRuns,
  currentClassIndex,
  runCount,
}: {
  classes: { classIndex: number; class: string }[];
  allRuns: CompetitorList;
  currentClassIndex: number;
  runCount: number;
}) => {
  const currentClassList = useMemo(() => {
    const classesList = classes.map((carClass) => ({
      carClass,
      drivers: allRuns.filter(
        (data) => data.classIndex === carClass.classIndex
      ),
    }));

    return classesList.filter(
      (a) => a.carClass.classIndex === currentClassIndex
    );
  }, [classes, allRuns, currentClassIndex]);

  return (
    <PrimaryPaper
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.12)',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
      }}
    >
      {currentClassList.map((eventClass) => (
        <Box key={eventClass.carClass.class} textAlign="left">
          <Box fontWeight="fontWeightMedium" display="inline" lineHeight="3">
            {eventClass.carClass.class}
          </Box>
          <Chip
            label={`Class Record: ${eventClass.drivers[0].classRecord}`}
            variant="outlined"
            color="info"
            size="medium"
            icon={<Timer />}
            sx={{ ml: 1 }}
          />
          <CompetitorTable
            data={eventClass.drivers.sort(
              (a, b) =>
                Math.min(...a.times.map((time) => time?.time || 10000000)) -
                Math.min(...b.times.map((time) => time?.time || 10000000))
            )}
            runCount={runCount}
          />
        </Box>
      ))}
    </PrimaryPaper>
  );
};

export const Announcer = () => {
  // ✅ Updated to tRPC v10-style queries
  const currentCompetitorId = trpc.currentcompetitor.number.useQuery(undefined);
  const competitorList = trpc.competitors.list.useQuery(undefined);
  const runCount = trpc.runs.count.useQuery(undefined);
  // Asked for directly rather than read out of the class table: the announcer
  // needs the speed for the car on course at a glance, not buried in a row
  const speed = trpc.speed.current.useQuery(undefined);

  // Dynamic refresh intervals from configuration
  const [announcerRefresh, setAnnouncerRefresh] = React.useState(2)
  const [fallbackInterval, setFallbackInterval] = React.useState(300)

  // Load refresh configuration on startup
  useEffect(() => {
    const loadRefreshConfig = async () => {
      try {
        const primaryInterval = await refreshConfigService.getRefreshIntervalForRoute('/announcer')
        const fallback = await refreshConfigService.getFallbackInterval()

        setAnnouncerRefresh(primaryInterval)
        setFallbackInterval(fallback)

        console.log(`🚀 [STARTUP] Announcer refresh configuration:`)
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
      console.log(`🔄 [PRIMARY] React Query refetch - Announcer`)
      await Promise.all([
        currentCompetitorId.refetch(),
        competitorList.refetch(),
        runCount.refetch(),
        speed.refetch(),
      ]);
      console.log(`✅ [PRIMARY] React Query refetch completed successfully`)
    } catch (error) {
      console.error('❌ [PRIMARY] Refetch failed:', error);
      // If refetch fails, trigger a full page refresh
      console.log('🔄 [ERROR-FALLBACK] Refetch failed, performing full page refresh')
      window.location.reload()
    }
  }, [currentCompetitorId.refetch, competitorList.refetch, runCount.refetch, speed.refetch]);

  // Primary refresh: React Query refetch at announcer intervals
  useEffect(() => {
    const interval = setInterval(refetchAll, 1000 * announcerRefresh);
    return () => clearInterval(interval);
  }, [refetchAll, announcerRefresh, fallbackInterval]);

  // Secondary refresh: Fallback full page refresh
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`🔄 [SECONDARY] Fallback refresh - Announcer (${Math.round(fallbackInterval / 60)}-minute interval)`)
      window.location.reload()
    }, 1000 * fallbackInterval) // Use configured interval

    return () => clearInterval(interval)
  }, [fallbackInterval])

  // Tertiary refresh: Error-based refresh for unhandled errors
  useEffect(() => {
    const handleError = () => {
      console.log(`🔄 [TERTIARY] Error-based refresh - Announcer (JavaScript error detected)`)
      window.location.reload()
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log(`🔄 [TERTIARY] Error-based refresh - Announcer (Unhandled promise rejection)`)
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



  const requestErrors = requestWrapper({
    currentCompetitorId,
    competitorList,
    runCount,
  });
  if (requestErrors) return requestErrors;

  if (!currentCompetitorId.data || !competitorList.data || !runCount.data) {
    console.warn('A function was called that should not be called');
    return null;
  }

  const currentCompetitor = (competitorList.data as Competitor[]).find(
    (run) => run.number === currentCompetitorId.data
  );

  type EventClass = {
    classIndex: number;
    class: string;
  };

  let classes: EventClass[] = (competitorList.data as Competitor[]).map((run) => ({
    classIndex: run.classIndex,
    class: run.class,
  }));

  classes = classes.filter(
    (classItem, index) =>
      classes.findIndex(
        (innerClass) => innerClass.classIndex === classItem.classIndex
      ) === index
  );

  const normalizedCompetitorList = competitorList.data.map((competitor) => ({
    ...competitor,
    times: competitor.times.map((t) => t ?? undefined), // convert null → undefined
  }));


  if (!currentCompetitor) {
    return (
      <Container maxWidth={false}>
        <Alert severity="error">
          Could not find a competitor that matches {currentCompetitorId.data}
        </Alert>
      </Container>
    );
  }

  // The live pass if the car is on the trap now, otherwise what was recorded for
  // the run they are on. Deliberately not an earlier run's speed: a stale number
  // read out as current is worse than none.
  const liveSpeed = speed.data?.speed ?? null;
  const thisRunSpeed = currentCompetitor.times.find(
    (time) => time && time.run === runCount.data
  )?.speed;
  const shownSpeed = liveSpeed ?? thisRunSpeed ?? null;

  return (
    <Container maxWidth={false}>
      <Typography component={'span'}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }}
        >
          <Grid size={{ xs: 4 }}>
            <PrimaryPaper
              sx={{
                fontSize: 24,
                height: 96,
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
              }}
            >
              {currentCompetitor.number}: {currentCompetitor.firstName}{' '}
              {currentCompetitor.lastName}, {currentCompetitor.vehicle}
              <br />
              {currentCompetitor.class}
            </PrimaryPaper>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <PrimaryPaperCenter
              sx={{
                fontSize: 48,
                fontWeight: 500,
                height: 96,
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
              }}
            >
              {currentCompetitor.special}
            </PrimaryPaperCenter>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <PrimaryPaperCenter
              sx={{
                fontSize: 48,
                fontWeight: 500,
                height: 96,
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
              }}
            >
              Run {runCount.data}
            </PrimaryPaperCenter>
          </Grid>
          {/* Speed for the car on course, stated outright */}
          <Grid size={{ xs: 3 }}>
            <PrimaryPaperCenter
              sx={{
                height: 96,
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ fontSize: 16, color: 'text.secondary', lineHeight: 1 }}>SPEED</Box>
              <Box sx={{ fontSize: 48, fontWeight: 500, lineHeight: 1.2 }}>
                {typeof shownSpeed === 'number' ? `${Math.round(shownSpeed)} kph` : '--'}
              </Box>
            </PrimaryPaperCenter>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <RenderInfo
              currentRun={currentCompetitor}
              allRuns={normalizedCompetitorList}
            />
          </Grid>
          <Grid size={{ xs: 8 }}>
            <RenderClassList
              classes={classes}
              allRuns={normalizedCompetitorList}
              currentClassIndex={currentCompetitor.classIndex}
              runCount={runCount.data}
            />
          </Grid>
        </Grid>
      </Typography>

      {/* Tri-Series Points Display */}
      <Box sx={{ mt: 2 }}>
        <TriSeriesPoints
          competitors={normalizedCompetitorList}
          maxDisplay={8}
        />
      </Box>
    </Container>
  );
};
