import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import React from 'react';
import { useState } from 'react';
import { trpc, useTrpcClient } from '../App';

import { requestWrapper } from '../components/requestWrapper';

export const Admin = () => {
  const trpcClient = useTrpcClient();

  // ✅ New v10-style hooks
  const setConfig = trpc.config.set.useMutation();
  const loading = setConfig.isPending;
  const config = trpc.config.get.useQuery(undefined);

  const [newConfig, setNewConfig] = useState(config.data || {});

  const requestErrors = requestWrapper({ config });
  if (requestErrors) return requestErrors;
  if (!config.data) return null;

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
    <Container>
      <h1>TODO: Protect this page with auth</h1>

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
          required
          fullWidth
          label="Event Name"
          defaultValue={config.data.eventName}
          onChange={(e) => {
            setConfig.reset();
            setNewConfig({ ...newConfig, eventName: e.target.value });
          }}
        />
      </Box>

      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={loading}
          sx={buttonSx}
          onClick={() => {
            setConfig.mutate(newConfig);
          }}
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
          disabled={loading}
          sx={buttonSx}
          onClick={async () => {
            const data = await trpcClient.endofdayresults.generate.query(); // ✅ updated for v10
            const mediaType =
              'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
            window.location.href = `${mediaType}${data.xlsx}`;
          }}
        >
          End of Day Results
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
    </Container>
  );
};
