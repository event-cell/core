// announcer.tsx

import React, { useEffect, useMemo } from 'react';
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

  // Refresh the data every 2 seconds
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await Promise.all([
        currentCompetitorId.refetch(),
        competitorList.refetch(),
        runCount.refetch(),
      ]);
    }, 1000 * 2);
    return () => clearTimeout(timeout);
  }, [currentCompetitorId, competitorList, runCount]);

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
          <Grid size={{xs:4}}>
            <PrimaryPaper sx={{ fontSize: 24, height: 96 }}>
              {currentCompetitor.number}: {currentCompetitor.firstName}{' '}
              {currentCompetitor.lastName}, {currentCompetitor.vehicle}
              <br />
              {currentCompetitor.class}
            </PrimaryPaper>
          </Grid>
          <Grid size={{xs:4}}>
            <PrimaryPaperCenter sx={{ fontSize: 48, fontWeight: 500, height: 96 }}>
              {currentCompetitor.special}
            </PrimaryPaperCenter>
          </Grid>
          <Grid size={{xs:4}}>
            <PrimaryPaperCenter sx={{ fontSize: 48, fontWeight: 500, height: 96 }}>
              Run {runCount.data}
            </PrimaryPaperCenter>
          </Grid>
          <Grid size={{xs:4}}>
            <RenderInfo
              currentRun={currentCompetitor}
              allRuns={normalizedCompetitorList}
            />
          </Grid>
          <Grid size={{xs:8}}>
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
