import React from 'react';
import StoreProvider from './StoreProvider';
import AppThemeProvider from './ThemeProvider';
import TenantProvider from './TenantProvider';
import { BrowserRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <StoreProvider>
    <AppThemeProvider>
      <BrowserRouter>
        <TenantProvider>
          {children}
        </TenantProvider>
      </BrowserRouter>
    </AppThemeProvider>
  </StoreProvider>
);

export default AppProviders;
