import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Chip, Tooltip } from '@mui/material';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { logout } from '../../auth/authSlice';
import { toggleDarkMode } from '../../multi-tenant/tenantSlice';
import { addAuditLog } from '../../store/slices/auditSlice';
import { selectCurrentUser } from '../../auth/authSelectors';
import { selectCurrentTenant, selectDarkMode } from '../../multi-tenant/tenantSelectors';
import { ROUTES } from '../../shared/constants/routes';
import { DESIGN_TOKENS } from '../../shared/constants/theme';
import GlobalSearch from '../navigation/GlobalSearch';

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = DESIGN_TOKENS.sidebarWidth;

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const tenant = useAppSelector(selectCurrentTenant);
  const darkMode = useAppSelector(selectDarkMode);
  const [sidebarWidth, setSidebarWidth] = useState<number>(EXPANDED_WIDTH);

  useEffect(() => {
    const handler = (e: CustomEvent) =>
      setSidebarWidth(e.detail.collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
    window.addEventListener('sidebar-toggle' as never, handler as EventListener);
    return () => window.removeEventListener('sidebar-toggle' as never, handler as EventListener);
  }, []);

  const handleLogout = () => {
    if (user && tenant) {
      dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'LOGOUT', module: 'auth' }));
    }
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{
      ml: `${sidebarWidth}px`,
      width: `calc(100% - ${sidebarWidth}px)`,
      transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
      height: DESIGN_TOKENS.navbarHeight,
      bgcolor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      color: 'text.primary',
    }}>
      <Toolbar sx={{ height: DESIGN_TOKENS.navbarHeight }}>
        <GlobalSearch />
        <Box sx={{ flex: 1 }} />
        <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
          <IconButton onClick={() => dispatch(toggleDarkMode())} size="small" sx={{ mr: 1 }}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </Tooltip>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>{user.name}</Typography>
              <Chip label={user.role} size="small" color="primary" sx={{ height: 16, fontSize: 10 }} />
            </Box>
          </Box>
        )}
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small"><LogOut size={18} /></IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
