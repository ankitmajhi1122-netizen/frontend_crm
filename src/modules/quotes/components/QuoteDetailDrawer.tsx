import React from 'react';
import { Avatar, Button, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import StatusChip from '../../../shared/components/StatusChip';
import { Quote } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const STATUS_COLORS: Record<string, string> = {
  draft: '#6B7280', sent: '#2563EB', active: '#059669', done: '#10B981', expired: '#EF4444',
};

interface QuoteDetailDrawerProps {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
  canSeeAmount?: boolean;
}

const QuoteDetailDrawer: React.FC<QuoteDetailDrawerProps> = ({ quote, open, onClose, onEdit, onDelete, canSeeAmount = true }) => {
  if (!quote) return null;
  const color = STATUS_COLORS[quote.status] ?? '#6B7280';

  const fields = [
    { label: 'Quote #', value: quote.number },
    { label: 'Status', value: <StatusChip label={quote.status} /> },
    { label: 'Contact', value: quote.contactName, fullWidth: true },
    ...(canSeeAmount ? [
      { label: 'Amount', value: <Typography fontWeight={700} color="success.main" variant="body2">{formatCurrency(quote.amount)}</Typography> },
    ] : []),
    { label: 'Valid Until', value: formatDate(quote.validUntil) },
    { label: 'Deal ID', value: quote.dealId || '—' },
    { label: 'Created', value: formatDate(quote.createdAt) },
    { label: 'Quote ID', value: quote.id, fullWidth: true },
    ...(quote.items.length > 0 ? [{
      label: 'Line Items', fullWidth: true,
      value: (
        <Box sx={{ mt: 0.5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, fontWeight: 700, p: '4px 8px' }}>Product</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 700, p: '4px 8px' }}>Qty</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 700, p: '4px 8px' }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quote.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: 12, p: '4px 8px' }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: 12, p: '4px 8px' }}>{item.qty}</TableCell>
                  <TableCell sx={{ fontSize: 12, p: '4px 8px' }}>{formatCurrency(item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ),
    }] : []),
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={quote.number}
      subtitle={quote.contactName}
      avatar={<Avatar sx={{ bgcolor: `${color}22` }}><FileText size={20} color={color} /></Avatar>}
      status={quote.status}
      statusColor={color}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(quote.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(quote); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default QuoteDetailDrawer;
