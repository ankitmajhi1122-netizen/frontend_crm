import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ShieldOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';

const PermissionDenied: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
      <ShieldOff size={64} color="#EF4444" />
      <Typography variant="h4" fontWeight={700}>403 — Permission Denied</Typography>
      <Typography variant="body1" color="text.secondary">You don't have permission to access this page.</Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>Go to Dashboard</Button>
    </Box>
  );
};

export default PermissionDenied;
