import React from 'react';
import { Avatar, Button, Chip, LinearProgress, Box, Typography } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import { Deal } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const STAGE_COLORS: Record<string, string> = {
  discovery: '#6B7280', proposal: '#2563EB', negotiation: '#F59E0B',
  closed_won: '#059669', closed_lost: '#EF4444',
};

interface DealDetailDrawerProps {
  deal: Deal | null;
  open: boolean;
  onClose: () => void;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
  canSeeMargin?: boolean;
}

const DealDetailDrawer: React.FC<DealDetailDrawerProps> = ({ deal, open, onClose, onEdit, onDelete, canSeeMargin = false }) => {
  if (!deal) return null;

  const fields = [
    { label: 'Value', value: <Typography fontWeight={700} color="success.main" variant="body2">{formatCurrency(deal.value)}</Typography> },
    { label: 'Revenue', value: formatCurrency(deal.revenue) },
    ...(canSeeMargin ? [
      { label: 'Cost', value: formatCurrency(deal.cost) },
      { label: 'Margin', value: `${deal.margin}%` },
    ] : []),
    {
      label: 'Probability', value: (
        <Box>
          <Typography variant="body2" fontWeight={600} mb={0.5}>{deal.probability}%</Typography>
          <LinearProgress variant="determinate" value={deal.probability}
            color={deal.probability >= 70 ? 'success' : deal.probability >= 40 ? 'warning' : 'error'}
            sx={{ height: 6, borderRadius: 3 }} />
        </Box>
      ), fullWidth: true
    },
    { label: 'Stage', value: <Chip label={deal.stage.replace('_', ' ')} size="small" sx={{ bgcolor: `${STAGE_COLORS[deal.stage]}22`, color: STAGE_COLORS[deal.stage], fontWeight: 600 }} /> },
    { label: 'Status', value: deal.status },
    { label: 'Close Date', value: formatDate(deal.closeDate) },
    { label: 'Created', value: formatDate(deal.createdAt) },
    { label: 'Contact ID', value: deal.contactId },
    { label: 'Account ID', value: deal.accountId },
    { label: 'Deal ID', value: deal.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={deal.title}
      subtitle={`${deal.stage.replace('_', ' ')} · ${formatCurrency(deal.value)}`}
      avatar={<Avatar sx={{ bgcolor: STAGE_COLORS[deal.stage] ?? '#6B7280' }}>{deal.title.charAt(0)}</Avatar>}
      status={deal.status}
      statusColor={deal.status === 'won' ? '#059669' : deal.status === 'lost' ? '#EF4444' : '#2563EB'}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(deal.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(deal); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default DealDetailDrawer;
