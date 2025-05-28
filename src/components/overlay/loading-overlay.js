import React from 'react';
import { Backdrop, CircularProgress, Box } from '@mui/material';

export default function LoadingOverlay({ open = false }) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 999,
        color: '#fff',
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <Box textAlign="center">
        <CircularProgress color="inherit" />
        <Box mt={2}>This operation will not take over 30 seconds...</Box>
      </Box>
    </Backdrop>
  );
}
