import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Slider,
  Switch,
  Divider,
  Alert,
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

  // Display configuration state
  const [displayConfig, setDisplayConfig] = useState({
    maxRowsPerDisplay: 20,
  });
  const [displayConfigLoading, setDisplayConfigLoading] = useState(false);
  const [displayConfigError, setDisplayConfigError] = useState<string | null>(null);

  // Refresh intervals configuration state
  const [refreshConfig, setRefreshConfig] = useState({
    display1: 15,
    display2: 15,
    display3: 15,
    display4: 5,
    trackDisplay: 2,
    announcer: 2,
    fallbackInterval: 300,
  });
  const [refreshConfigLoading, setRefreshConfigLoading] = useState(false);
  const [refreshConfigError, setRefreshConfigError] = useState<string | null>(null);

  // Initialize newConfig with default values to prevent undefined errors
  const [newConfig, setNewConfig] = useState({
    eventId: '',
    eventName: '',
    eventDate: '',
    uploadLiveTiming: false
  });

  // Load display configuration using tRPC
  useEffect(() => {
    const loadDisplayConfig = async () => {
      setDisplayConfigLoading(true);
      setDisplayConfigError(null);
      try {
        const configData = await trpcClient.config.getDisplayDistribution.query();
        setDisplayConfig(configData);
      } catch (error) {
        console.error('Failed to load display configuration:', error);
        setDisplayConfigError('Failed to load display configuration. Using defaults.');
      } finally {
        setDisplayConfigLoading(false);
      }
    };

    loadDisplayConfig();
  }, [trpcClient.config.getDisplayDistribution]);

  // Load refresh intervals configuration using tRPC
  useEffect(() => {
    const loadRefreshConfig = async () => {
      setRefreshConfigLoading(true);
      setRefreshConfigError(null);
      try {
        const configData = await trpcClient.config.getRefreshIntervals.query();
        setRefreshConfig(configData);
      } catch (error) {
        console.error('Failed to load refresh configuration:', error);
        setRefreshConfigError('Failed to load refresh configuration. Using defaults.');
      } finally {
        setRefreshConfigLoading(false);
      }
    };

    loadRefreshConfig();
  }, [trpcClient.config.getRefreshIntervals]);

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

  // Function to handle saving display configuration using tRPC
  const handleSaveDisplayConfig = async () => {
    setDisplayConfigLoading(true);
    setDisplayConfigError(null);
    try {
      const updatedConfig = await trpcClient.config.setDisplayDistribution.mutate(displayConfig);
      setDisplayConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to save display configuration:', error);
      setDisplayConfigError('Failed to save display configuration.');
    } finally {
      setDisplayConfigLoading(false);
    }
  };

  // Function to handle saving refresh configuration using tRPC
  const handleSaveRefreshConfig = async () => {
    setRefreshConfigLoading(true);
    setRefreshConfigError(null);
    try {
      const updatedConfig = await trpcClient.config.setRefreshIntervals.mutate(refreshConfig);
      setRefreshConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to save refresh configuration:', error);
      setRefreshConfigError('Failed to save refresh configuration.');
    } finally {
      setRefreshConfigLoading(false);
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Event Configuration */}
        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Event Configuration
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
        </Box>

        {/* Live Timing Settings */}
        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
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

        {/* Display Configuration */}
        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Display Configuration
          </Typography>

          {displayConfigError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {displayConfigError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Max Rows Per Display */}
            <Box>
              <Typography gutterBottom>
                Maximum Rows Per Display: {displayConfig.maxRowsPerDisplay}
              </Typography>
              <Slider
                value={displayConfig.maxRowsPerDisplay}
                onChange={(_, value) => setDisplayConfig({
                  ...displayConfig,
                  maxRowsPerDisplay: value as number
                })}
                min={15}
                max={30}
                step={1}
                marks={[
                  { value: 15, label: '15' },
                  { value: 20, label: '20' },
                  { value: 25, label: '25' },
                  { value: 30, label: '30' },
                ]}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" color="text.secondary">
                Maximum number of rows allowed per display
              </Typography>
            </Box>

          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              disabled={displayConfigLoading}
              onClick={handleSaveDisplayConfig}
              sx={{
                ...(displayConfigLoading && { bgcolor: green[500] }),
              }}
            >
              Save Display Configuration
            </Button>
            {displayConfigLoading && (
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
        </Box>

        {/* Refresh Configuration */}
        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Refresh Configuration
          </Typography>

          {refreshConfigError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {refreshConfigError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Display Routes */}
            <Typography variant="subtitle1" fontWeight="bold">
              Display Routes (Primary Refresh Intervals)
            </Typography>

            <Box>
              <Typography gutterBottom>
                Display 1: {refreshConfig.display1} seconds
              </Typography>
              <Slider
                value={refreshConfig.display1}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  display1: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 15, label: '15s' },
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Display 2: {refreshConfig.display2} seconds
              </Typography>
              <Slider
                value={refreshConfig.display2}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  display2: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 15, label: '15s' },
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Display 3: {refreshConfig.display3} seconds
              </Typography>
              <Slider
                value={refreshConfig.display3}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  display3: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 15, label: '15s' },
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Display 4: {refreshConfig.display4} seconds
              </Typography>
              <Slider
                value={refreshConfig.display4}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  display4: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 5, label: '5s' },
                  { value: 15, label: '15s' },
                  { value: 60, label: '1m' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Other Routes */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Other Routes
            </Typography>

            <Box>
              <Typography gutterBottom>
                Track Display: {refreshConfig.trackDisplay} seconds
              </Typography>
              <Slider
                value={refreshConfig.trackDisplay}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  trackDisplay: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 2, label: '2s' },
                  { value: 5, label: '5s' },
                  { value: 15, label: '15s' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Announcer: {refreshConfig.announcer} seconds
              </Typography>
              <Slider
                value={refreshConfig.announcer}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  announcer: value as number
                })}
                min={1}
                max={300}
                step={1}
                marks={[
                  { value: 1, label: '1s' },
                  { value: 2, label: '2s' },
                  { value: 5, label: '5s' },
                  { value: 15, label: '15s' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>



            <Box>
              <Typography gutterBottom>
                Fallback Refresh: {refreshConfig.fallbackInterval} seconds ({Math.round(refreshConfig.fallbackInterval / 60)} minutes)
              </Typography>
              <Slider
                value={refreshConfig.fallbackInterval}
                onChange={(_, value) => setRefreshConfig({
                  ...refreshConfig,
                  fallbackInterval: value as number
                })}
                min={60}
                max={1800}
                step={30}
                marks={[
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' },
                  { value: 600, label: '10m' },
                  { value: 1800, label: '30m' },
                ]}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" color="text.secondary">
                Full page refresh interval for all routes
              </Typography>
            </Box>



          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              disabled={refreshConfigLoading}
              onClick={handleSaveRefreshConfig}
              sx={{
                ...(refreshConfigLoading && { bgcolor: green[500] }),
              }}
            >
              Save Refresh Configuration
            </Button>
            {refreshConfigLoading && (
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
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              disabled={loading}
              sx={buttonSx}
              onClick={handleSave}
            >
              Save Event Configuration
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

          <Box sx={{ position: 'relative' }}>
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
        </Box>
      </Box>
    </Container>
  );
};
