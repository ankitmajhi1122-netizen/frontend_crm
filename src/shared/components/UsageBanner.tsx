import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { useAppSelector } from '../../app/store/hooks';
import { selectCurrentSubscription, selectCurrentTenant } from '../../multi-tenant/tenantSelectors';
import { isExpired } from '../utils/dateUtils';

const UsageBanner: React.FC = React.memo(() => {
  const subscription = useAppSelector(selectCurrentSubscription);
  const tenant = useAppSelector(selectCurrentTenant);

  // Read live user count from Redux store (includes admin-added employees)
  const allUsers = useAppSelector((s) => s.users.items);
  const tenantUserCount = allUsers.filter(
    (u) => u.tenantId === tenant?.id && u.status === 'active'
  ).length;

  if (!subscription) return null;

  const expired = isExpired(subscription.expiryDate);
  const maxUsers = subscription.maxUsers;

  // Show warning when >= 80% of user limit is used (dynamic, not hardcoded)
  const usageRatio = maxUsers < 9999 ? tenantUserCount / maxUsers : 0;
  const nearLimit = usageRatio >= 0.8 && !expired;

  if (!expired && !nearLimit) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {expired && (
        <Alert severity="error" action={<Button color="inherit" size="small">Renew</Button>}>
          <AlertTitle>Subscription Expired</AlertTitle>
          Your plan expired. Please renew to continue accessing all features.
        </Alert>
      )}
      {!expired && nearLimit && (
        <Alert severity="warning" action={<Button color="inherit" size="small">Upgrade</Button>}>
          <AlertTitle>User Limit Approaching</AlertTitle>
          You are on the <strong>{subscription.plan}</strong> plan —{' '}
          <strong>{tenantUserCount}</strong> of <strong>{maxUsers}</strong> users used.
          {tenantUserCount >= maxUsers
            ? ' Limit reached. Upgrade to add more team members.'
            : ' Upgrade soon to avoid disruption.'}
        </Alert>
      )}
    </Box>
  );
});

UsageBanner.displayName = 'UsageBanner';
export default UsageBanner;
