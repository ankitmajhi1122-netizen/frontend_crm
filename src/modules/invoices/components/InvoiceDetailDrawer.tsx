import React from 'react';
import { Avatar, Button, Typography } from '@mui/material';
import { Receipt, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import StatusChip from '../../../shared/components/StatusChip';
import { Invoice } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const STATUS_COLORS: Record<string, string> = {
  draft: '#6B7280', sent: '#2563EB', paid: '#059669', pending: '#F59E0B', overdue: '#EF4444',
};

interface InvoiceDetailDrawerProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  canSeeAmount?: boolean;
}

const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({ invoice, open, onClose, onEdit, onDelete, canSeeAmount = true }) => {
  if (!invoice) return null;
  const color = STATUS_COLORS[invoice.status] ?? '#6B7280';

  const fields = [
    { label: 'Invoice #', value: invoice.number },
    { label: 'Status', value: <StatusChip label={invoice.status} /> },
    { label: 'Client', value: invoice.client, fullWidth: true },
    ...(canSeeAmount ? [
      { label: 'Amount', value: formatCurrency(invoice.amount) },
      { label: 'Tax', value: formatCurrency(invoice.tax) },
      { label: 'Total', value: <Typography fontWeight={700} color="success.main" variant="body2">{formatCurrency(invoice.total)}</Typography>, fullWidth: true },
    ] : []),
    { label: 'Due Date', value: formatDate(invoice.dueDate) },
    { label: 'Created', value: formatDate(invoice.createdAt) },
    { label: 'Quote ID', value: invoice.quoteId ?? '—' },
    { label: 'Invoice ID', value: invoice.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={invoice.number}
      subtitle={invoice.client}
      avatar={<Avatar sx={{ bgcolor: `${color}22` }}><Receipt size={20} color={color} /></Avatar>}
      status={invoice.status}
      statusColor={color}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(invoice.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(invoice); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default InvoiceDetailDrawer;
