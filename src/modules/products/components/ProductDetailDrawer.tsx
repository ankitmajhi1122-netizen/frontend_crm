import React from 'react';
import { Avatar, Button, Chip } from '@mui/material';
import { Package, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import StatusChip from '../../../shared/components/StatusChip';
import { Product } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const CAT_COLORS: Record<string, string> = {
  Software: '#2563EB', Service: '#059669', 'Add-on': '#F59E0B',
  Hardware: '#EF4444', Consulting: '#8B5CF6', Other: '#6B7280',
};

interface ProductDetailDrawerProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  canSeePrice?: boolean;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({ product, open, onClose, onEdit, onDelete, canSeePrice = true }) => {
  if (!product) return null;
  const color = CAT_COLORS[product.category] ?? '#6B7280';

  const fields = [
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: <Chip label={product.category} size="small" sx={{ bgcolor: `${color}22`, color, fontWeight: 600 }} /> },
    ...(canSeePrice ? [{ label: 'Price/mo', value: formatCurrency(product.price) }] : []),
    { label: 'Stock', value: product.stock >= 999 ? 'Unlimited' : product.stock.toString() },
    { label: 'Status', value: <StatusChip label={product.status} /> },
    { label: 'Description', value: product.description || '—', fullWidth: true },
    { label: 'Created', value: formatDate(product.createdAt) },
    { label: 'Updated', value: formatDate(product.updatedAt) },
    { label: 'Product ID', value: product.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={product.name}
      subtitle={product.category}
      avatar={<Avatar sx={{ bgcolor: `${color}22` }}><Package size={20} color={color} /></Avatar>}
      status={product.status}
      statusColor={product.status === 'active' ? '#059669' : '#6B7280'}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(product.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(product); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default ProductDetailDrawer;
