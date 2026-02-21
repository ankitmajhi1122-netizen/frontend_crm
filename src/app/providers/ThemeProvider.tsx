import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { selectDarkMode, selectPrimaryColor } from '../../multi-tenant/tenantSelectors';
import { DESIGN_TOKENS } from '../../shared/constants/theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const darkMode = useAppSelector(selectDarkMode);
  const primaryColor = useAppSelector(selectPrimaryColor);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: primaryColor || DESIGN_TOKENS.colors.primary },
          background: {
            default: darkMode ? '#0F172A' : DESIGN_TOKENS.colors.background,
            paper: darkMode ? '#1E293B' : '#FFFFFF',
          },
        },
        shape: { borderRadius: 12 },
        spacing: DESIGN_TOKENS.spacing,
        components: {
          MuiCard: {
            styleOverrides: {
              root: { padding: DESIGN_TOKENS.cardPadding, borderRadius: DESIGN_TOKENS.cardRadius },
            },
          },
          MuiDialog: {
            defaultProps: {
              disableScrollLock: true,
            },
          },
          MuiPopover: {
            defaultProps: {
              disableScrollLock: true,
            },
          },
        },
      }),
    [darkMode, primaryColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
