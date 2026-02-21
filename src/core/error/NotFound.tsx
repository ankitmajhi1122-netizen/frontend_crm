import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
      <SearchX size={64} color="#6B7280" />
      <Typography variant="h4" fontWeight={700}>404 — Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary">The page you're looking for doesn't exist.</Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>Go to Dashboard</Button>
    </Box>
  );
};

export default NotFound;
