import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { DESIGN_TOKENS } from '../../shared/constants/theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = DESIGN_TOKENS.sidebarWidth;

const MainLayout: React.FC<MainLayoutProps> = React.memo(({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(EXPANDED_WIDTH);

  // Listen for sidebar collapse events via custom event
  useEffect(() => {
    const handler = (e: CustomEvent) => setSidebarWidth(e.detail.collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
    window.addEventListener('sidebar-toggle' as never, handler as EventListener);
    return () => window.removeEventListener('sidebar-toggle' as never, handler as EventListener);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: `${sidebarWidth}px`, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <Navbar />
        <Box component="main" sx={{ flex: 1, p: 3, mt: `${DESIGN_TOKENS.navbarHeight}px`, bgcolor: 'background.default' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
});

MainLayout.displayName = 'MainLayout';
export default MainLayout;
