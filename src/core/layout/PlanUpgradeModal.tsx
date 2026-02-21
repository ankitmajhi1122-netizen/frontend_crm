import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Lock } from 'lucide-react';
import { useAppSelector } from '../../app/store/hooks';
import { selectTenantPlan } from '../../multi-tenant/tenantSelectors';

interface PlanUpgradeModalProps {
  module: string;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({ module }) => {
  const plan = useAppSelector(selectTenantPlan);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <Card sx={{ maxWidth: 420, textAlign: 'center', p: 4 }}>
        <CardContent>
          <Lock size={48} color="#F59E0B" />
          <Typography variant="h5" fontWeight={700} mt={2} mb={1}>
            Upgrade Required
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            The <strong>{module}</strong> module is not available on your current <strong>{plan}</strong> plan.
            Upgrade to unlock this feature.
          </Typography>
          <Button variant="contained" color="warning" size="large">
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlanUpgradeModal;
