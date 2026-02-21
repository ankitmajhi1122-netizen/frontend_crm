import React from 'react';
import { Box } from '@mui/material';
import UsageBanner from './UsageBanner';
import ErrorBoundary from '../../core/error/ErrorBoundary';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Box sx={{
        animation: 'fadeSlideIn 0.25s ease-out',
        '@keyframes fadeSlideIn': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}>
        <UsageBanner />
        <Box>{children}</Box>
      </Box>
    </ErrorBoundary>
  );
};

export default PageWrapper;
