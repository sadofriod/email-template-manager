import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Email } from '@mui/icons-material';

const WelcomeMessage: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        py: 8,
        backgroundColor: 'transparent',
      }}
    >
      <Email sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Email Template Manager
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
        Select a template from the sidebar to edit, or create a new one to get started. 
        You can manage email templates for different applications and template types.
      </Typography>
    </Paper>
  );
};

export default WelcomeMessage;