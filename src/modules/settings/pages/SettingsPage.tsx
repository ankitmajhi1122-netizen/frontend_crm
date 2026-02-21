import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemText,
  Divider, Switch, FormControlLabel, Tabs, Tab,
} from '@mui/material';
import { Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { toggleDarkMode } from '../../../multi-tenant/tenantSlice';
import { selectDarkMode, selectCurrentTenant, selectCurrentSubscription } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import WithPermission from '../../../core/role-access/withPermission';
import PageWrapper from '../../../shared/components/PageWrapper';
import { formatDate } from '../../../shared/utils/dateUtils';
import { PLAN_LABELS } from '../../../shared/constants/plans';
import AuditLogViewer from '../components/AuditLogViewer';
import UserManagement from '../components/UserManagement';
import ChangePasswordForm from '../components/ChangePasswordForm';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);
  const subscription = useAppSelector(selectCurrentSubscription);
  const [tab, setTab] = useState(0);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Settings size={24} />
        <Typography variant="h5" fontWeight={700}>Settings</Typography>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="General" />
        <Tab label="Organization" />
        <Tab label="Profile" />
        <Tab label="Users" />
        <Tab label="Audit Log" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Appearance</Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} />}
              label="Dark Mode"
            />
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Organization</Typography>
              <List dense>
                <ListItem><ListItemText primary="Name" secondary={tenant?.name ?? '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Domain" secondary={tenant?.domain ?? '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Plan" secondary={subscription ? PLAN_LABELS[subscription.plan] : '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Plan Expires" secondary={subscription ? formatDate(subscription.expiryDate) : '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Max Users" secondary={subscription?.maxUsers ?? '—'} /></ListItem>
              </List>
            </CardContent>
          </Card>
          <WithPermission permission="settings:billing">
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>Billing (Admin Only)</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your subscription, payment methods and invoices.
                </Typography>
              </CardContent>
            </Card>
          </WithPermission>
        </>
      )}

      {tab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profile info */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Profile</Typography>
              <List dense>
                <ListItem><ListItemText primary="Name" secondary={user?.name ?? '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Email" secondary={user?.email ?? '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Role" secondary={user?.role ?? '—'} /></ListItem>
                <Divider />
                <ListItem><ListItemText primary="Organisation" secondary={tenant?.name ?? '—'} /></ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </Box>
      )}

      {tab === 3 && (
        <WithPermission permission="settings:users">
          <UserManagement />
        </WithPermission>
      )}
      {tab === 4 && (
        <WithPermission permission="settings:users">
          <AuditLogViewer />
        </WithPermission>
      )}
    </PageWrapper>
  );
};

export default SettingsPage;
