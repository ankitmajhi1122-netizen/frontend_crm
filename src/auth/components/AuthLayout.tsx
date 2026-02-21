import React from 'react';
import { Box, Typography } from '@mui/material';
import { Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#0F172A',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 60%)',
      py: 4,
    }}
  >
    <Box sx={{ width: '100%', maxWidth: 460, px: 2 }}>
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: '#2563EB',
            mb: 2,
          }}
        >
          <Zap size={28} color="white" />
        </Box>
        <Typography variant="h4" fontWeight={800} color="white" letterSpacing={-0.5}>
          CRM Pro
        </Typography>
        <Typography color="rgba(255,255,255,0.5)" fontSize={14} mt={0.5}>
          Enterprise SaaS Platform
        </Typography>
      </Box>

      {children}
    </Box>
  </Box>
);

export default AuthLayout;
