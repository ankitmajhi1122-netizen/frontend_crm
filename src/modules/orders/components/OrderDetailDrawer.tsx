import React from 'react';
import { Avatar, Button, Typography } from '@mui/material';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import StatusChip from '../../../shared/components/StatusChip';
import { Order } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', in_progress: '#2563EB', done: '#059669', cancelled: '#EF4444',
};

interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  canSeeTotal?: boolean;
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({ order, open, onClose, onEdit, onDelete, canSeeTotal = true }) => {
  if (!order) return null;
  const color = STATUS_COLORS[order.status] ?? '#6B7280';

  const fields = [
    { label: 'Order #', value: order.number },
    { label: 'Status', value: <StatusChip label={order.status} /> },
    { label: 'Client', value: order.client, fullWidth: true },
    { label: 'Items', value: order.items.toString() },
    ...(canSeeTotal ? [
      { label: 'Subtotal', value: formatCurrency(order.subtotal) },
      { label: 'Tax', value: formatCurrency(order.tax) },
      { label: 'Total', value: <Typography fontWeight={700} color="success.main" variant="body2">{formatCurrency(order.total)}</Typography>, fullWidth: true },
    ] : []),
    { label: 'Order Date', value: formatDate(order.orderDate) },
    { label: 'Delivery Date', value: order.deliveryDate ? formatDate(order.deliveryDate) : '—' },
    { label: 'Created', value: formatDate(order.createdAt) },
    { label: 'Order ID', value: order.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={order.number}
      subtitle={order.client}
      avatar={<Avatar sx={{ bgcolor: `${color}22` }}><ShoppingCart size={20} color={color} /></Avatar>}
      status={order.status}
      statusColor={color}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(order.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(order); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default OrderDetailDrawer;
