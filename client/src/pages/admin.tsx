import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { useState, useEffect } from 'react';
import { trpc, useTrpcClient } from '../App.js';
import dayjs from 'dayjs';

import { requestWrapper } from '../components/requestWrapper.js';

export const Admin = () => {
  const trpcClient = useTrpcClient();

  // ✅ New v10-style hooks
  const setConfig = trpc.config.set.useMutation();
  const loading = setConfig.isPending;
  const config = trpc.config.get.useQuery(undefined);
  const [isEndOfDayLoading, setIsEndOfDayLoading] = useState(false);
  const [isLoadingEventDate, setIsLoadingEventDate] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Initialize newConfig with default values to prevent undefined errors
  const [newConfig, setNewConfig] = useState({
    eventId: '',
    eventName: '',
    eventDate: '',
    uploadLiveTiming: false
  });

  // Update newConfig when config.data changes
  useEffect(() => {
    if (config.data) {
      setNewConfig({
        eventId: config.data.eventId || '',
        eventName: config.data.eventName || '',
        eventDate: config.data.eventDate || '',
        uploadLiveTiming: config.data.uploadLiveTiming || false
      });
    }
  }, [config.data]);

  const requestErrors = requestWrapper({ config });
  if (requestErrors) return requestErrors;
  if (!config.data) return null;

  // Function to fetch event date
  const fetchEventDate = async () => {
    setIsLoadingEventDate(true);
    try {
      // Get the event name from the configuration
      const eventName = config.data?.eventName || '';

      // Update the newConfig with the event name
      setNewConfig(prev => ({
        ...prev,
        eventName: eventName
      }));
    } catch (error) {
      console.error('Failed to get event name from configuration:', error);
      // If we can't get the event name, use a default name with the current date
      const currentDate = dayjs().format('MMMM D, YYYY');
      setNewConfig(prev => ({
        ...prev,
        eventName: currentDate
      }));
    } finally {
      setIsLoadingEventDate(false);
      setInitialLoadDone(true);
    }
  };

  // If we haven't done the initial load yet, do it now
  if (!initialLoadDone && config.data) {
    // Use requestAnimationFrame to schedule this for the next frame
    // This avoids React hooks errors
    requestAnimationFrame(() => {
      fetchEventDate();
    });
  }

  // Function to handle saving the configuration
  const handleSave = async () => {
    try {
      // Save the configuration and get the updated values
      const result = await setConfig.mutateAsync(newConfig);

      // Update the state with the returned values
      setNewConfig({
        eventId: result.eventId,
        eventName: result.eventName,
        eventDate: result.eventDate,
        uploadLiveTiming: result.uploadLiveTiming
      });
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const buttonSx = {
    ...(setConfig.status === 'success' && {
      bgcolor: green[500],
      '&:hover': { bgcolor: green[700] },
    }),
    ...(setConfig.status === 'error' && {
      bgcolor: red[500],
      '&:hover': { bgcolor: red[700] },
    }),
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          required
          fullWidth
          label="Event ID"
          defaultValue={config.data.eventId}
          onChange={(e) => {
            setConfig.reset();
            setNewConfig({ ...newConfig, eventId: e.target.value });
          }}
        />
        <TextField
          fullWidth
          label="Event Name"
          value={newConfig.eventName || ''}
          InputProps={{
            readOnly: true,
            endAdornment: isLoadingEventDate ? (
              <CircularProgress size={20} />
            ) : null,
          }}
        />
      </Box>
      <Box mt={4} p={2} border={1} borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Live Timing Settings
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={!!newConfig.uploadLiveTiming}
              onChange={(e) =>
                setNewConfig({
                  ...newConfig,
                  uploadLiveTiming: e.target.checked,
                })
              }
            />
          }
          label="Upload Live Timing"
        />


      </Box>

      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={loading}
          sx={buttonSx}
          onClick={handleSave}
        >
          Save
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={isEndOfDayLoading}
          sx={buttonSx}
          onClick={async () => {
            setIsEndOfDayLoading(true);
            try {
              const data = await trpcClient.endofdayresults.generate.query();
              const mediaType =
                'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
              window.location.href = `${mediaType}${data.xlsx}`;
            } finally {
              setIsEndOfDayLoading(false);
            }
          }}
        >
          End of Day Results
        </Button>
        {isEndOfDayLoading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Container>
  );
};
