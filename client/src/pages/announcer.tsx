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
import { RenderInfo, CompetitorTable } from 'ui-shared';
import { requestWrapper } from '../components/requestWrapper.js';
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
    <PrimaryPaper>
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

  // Announcer refresh interval (2 seconds for real-time updates)
  const announcerRefresh = 2

  // Log refresh configuration on startup
  useEffect(() => {
    console.log(`🚀 [STARTUP] Announcer refresh configuration:`)
    console.log(`   - Primary refresh: ${announcerRefresh} seconds (React Query)`)
    console.log(`   - Secondary refresh: 300 seconds (5 minutes fallback)`)
    console.log(`   - Health check: 30 seconds (responsiveness monitoring)`)
    console.log(`   - Error-based refresh: enabled (automatic error recovery)`)
  }, [announcerRefresh])

  // Create a stable refetch function with error handling
  const refetchAll = useCallback(async () => {
    try {
      console.log(`🔄 [PRIMARY] React Query refetch - Announcer`)
      await Promise.all([
        currentCompetitorId.refetch(),
        competitorList.refetch(),
        runCount.refetch(),
      ]);
      console.log(`✅ [PRIMARY] React Query refetch completed successfully`)
    } catch (error) {
      console.error('❌ [PRIMARY] Refetch failed:', error);
      // If refetch fails, trigger a full page refresh
      console.log('🔄 [ERROR-FALLBACK] Refetch failed, performing full page refresh')
      window.location.reload()
    }
  }, [currentCompetitorId.refetch, competitorList.refetch, runCount.refetch]);

  // Primary refresh: React Query refetch at announcer intervals
  useEffect(() => {
    const interval = setInterval(refetchAll, 1000 * announcerRefresh);
    return () => clearInterval(interval);
  }, [refetchAll, announcerRefresh]);

  // Secondary refresh: Fallback full page refresh every 5 minutes
  useEffect(() => {
    const fallbackInterval = setInterval(() => {
      console.log(`🔄 [SECONDARY] Fallback refresh - Announcer (5-minute interval)`)
      window.location.reload()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(fallbackInterval)
  }, [])

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

  // Health check: Refresh if app becomes unresponsive (no activity for 2 minutes)
  useEffect(() => {
    let lastActivity = Date.now()

    const checkHealth = () => {
      const now = Date.now()
      if (now - lastActivity > 2 * 60 * 1000) { // 2 minutes of inactivity
        console.log(`🔄 [HEALTH] Responsiveness refresh - Announcer (No activity for 2+ minutes)`)
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

  return (
    <Container maxWidth={false}>
      <Typography component={'span'}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }}
        >
          <Grid size={{ xs: 4 }}>
            <PrimaryPaper sx={{ fontSize: 24, height: 96 }}>
              {currentCompetitor.number}: {currentCompetitor.firstName}{' '}
              {currentCompetitor.lastName}, {currentCompetitor.vehicle}
              <br />
              {currentCompetitor.class}
            </PrimaryPaper>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <PrimaryPaperCenter sx={{ fontSize: 48, fontWeight: 500, height: 96 }}>
              {currentCompetitor.special}
            </PrimaryPaperCenter>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <PrimaryPaperCenter sx={{ fontSize: 48, fontWeight: 500, height: 96 }}>
              Run {runCount.data}
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
    </Container>
  );
};
