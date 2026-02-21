import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { MODULE_ROUTES } from '../../app/router/routeConfig';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const route = MODULE_ROUTES.find((r) => r.path === location.pathname);

  return (
    <MuiBreadcrumbs sx={{ mb: 2 }}>
      <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', fontSize: 13 }}>
        Home
      </Link>
      {route && (
        <Typography color="text.primary" fontSize={13} fontWeight={600}>
          {route.label}
        </Typography>
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
