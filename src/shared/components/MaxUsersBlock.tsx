import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Users } from 'lucide-react';
import { useAppSelector } from '../../app/store/hooks';
import { selectCurrentSubscription, selectCurrentTenant } from '../../multi-tenant/tenantSelectors';

interface MaxUsersBlockProps {
  children: React.ReactNode;
}

const MaxUsersBlock: React.FC<MaxUsersBlockProps> = ({ children }) => {
  const subscription = useAppSelector(selectCurrentSubscription);
  const tenant = useAppSelector(selectCurrentTenant);

  // Read from live Redux store — includes admin-added employees
  const allUsers = useAppSelector((s) => s.users.items);
  const tenantUserCount = allUsers.filter((u) => u.tenantId === tenant?.id && u.status === 'active').length;

  const maxUsers = subscription?.maxUsers ?? 5;
  const isBlocked = tenantUserCount >= maxUsers && maxUsers < 9999;

  if (isBlocked) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Card sx={{ maxWidth: 420, textAlign: 'center', p: 4 }}>
          <CardContent>
            <Users size={48} color="#EF4444" />
            <Typography variant="h5" fontWeight={700} mt={2} mb={1}>
              User Limit Reached
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Your <strong>{subscription?.plan}</strong> plan allows a maximum of{' '}
              <strong>{maxUsers} users</strong>. You currently have{' '}
              <strong>{tenantUserCount} active users</strong>.
              <br />Upgrade your plan to add more users.
            </Typography>
            <Button variant="contained" color="error" size="large">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return <>{children}</>;
};

export default MaxUsersBlock;
