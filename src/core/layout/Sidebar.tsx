import React, { useState, useCallback } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Building2, Handshake, Activity, Megaphone, Package, FileText, Receipt, ShoppingCart, TrendingUp, BarChart2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../app/store/hooks';
import { selectTenantFeatures } from '../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../auth/authSelectors';
import { MODULE_ROUTES } from '../../app/router/routeConfig';
import OrganizationSwitcher from '../../multi-tenant/OrganizationSwitcher';
import { DESIGN_TOKENS } from '../../shared/constants/theme';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />, UserPlus: <UserPlus size={20} />,
  Users: <Users size={20} />, Building2: <Building2 size={20} />, Handshake: <Handshake size={20} />,
  Activity: <Activity size={20} />, Megaphone: <Megaphone size={20} />, Package: <Package size={20} />,
  FileText: <FileText size={20} />, Receipt: <Receipt size={20} />, ShoppingCart: <ShoppingCart size={20} />,
  TrendingUp: <TrendingUp size={20} />, BarChart2: <BarChart2 size={20} />, Settings: <Settings size={20} />,
};

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = DESIGN_TOKENS.sidebarWidth;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const features = useAppSelector(selectTenantFeatures);
  const user = useAppSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { collapsed: next } }));
      return next;
    });
  }, []);


  const visibleRoutes = MODULE_ROUTES.filter(
    (r) => features.includes(r.module) && user !== null && r.requiredRole.includes(user.role)
  );

  return (
    <Box sx={{
      width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      backgroundColor: DESIGN_TOKENS.colors.sidebar,
      color: DESIGN_TOKENS.colors.sidebarText,
      position: 'fixed', top: 0, left: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      zIndex: 1200, overflowX: 'hidden', overflowY: 'auto',
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 64 }}>
        <Box sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.15s', overflow: 'hidden' }}>
          <Typography variant="h6" fontWeight={700} color="white" noWrap>⚡ CRM Pro</Typography>
        </Box>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton onClick={toggleCollapse} size="small" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' }, ml: collapsed ? 'auto' : 0 }}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </Tooltip>
      </Box>

      {!collapsed && (
        <>
          <OrganizationSwitcher />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />
        </>
      )}

      <List dense sx={{ flex: 1, px: collapsed ? 0.5 : 1 }}>
        {visibleRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Tooltip key={route.path} title={collapsed ? route.label : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(route.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2, mb: 0.5,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  bgcolor: isActive ? 'rgba(37,99,235,0.7)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                  '&.Mui-selected': { bgcolor: 'rgba(37,99,235,0.7)' },
                  minHeight: 40, px: collapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 36, color: 'inherit', justifyContent: 'center' }}>
                  {ICON_MAP[route.icon]}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText primary={route.label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400, noWrap: true }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
