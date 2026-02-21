import React from 'react';
import { Box, Typography } from '@mui/material';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  title = 'No data found',
  description = 'There are no records to display.',
  icon = <Inbox size={48} />,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, color: 'text.secondary', gap: 1 }}>
    {icon}
    <Typography variant="h6" fontWeight={600} mt={1}>{title}</Typography>
    <Typography variant="body2">{description}</Typography>
  </Box>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;
