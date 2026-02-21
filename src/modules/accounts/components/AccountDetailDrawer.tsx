import React from 'react';
import { Avatar, Button, Chip } from '@mui/material';
import { Globe, Mail, Phone, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import { Account } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const INDUSTRY_COLOR_PALETTE = ['#2563EB', '#7C3AED', '#059669', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6'];
const industryColorCache: Record<string, string> = {};
function getIndustryColor(industry: string): string {
  if (!industryColorCache[industry]) {
    const idx = Object.keys(industryColorCache).length % INDUSTRY_COLOR_PALETTE.length;
    industryColorCache[industry] = INDUSTRY_COLOR_PALETTE[idx];
  }
  return industryColorCache[industry];
}

interface AccountDetailDrawerProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  canSeeRevenue?: boolean;
}

const AccountDetailDrawer: React.FC<AccountDetailDrawerProps> = ({ account, open, onClose, onEdit, onDelete, canSeeRevenue = false }) => {
  if (!account) return null;
  const color = getIndustryColor(account.industry);

  const fields = [
    { label: 'Website', value: <><Globe size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{account.website || '—'}</>, fullWidth: true },
    { label: 'Email', value: <><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{account.email || '—'}</>, fullWidth: true },
    { label: 'Phone', value: <><Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{account.phone || '—'}</> },
    { label: 'Employees', value: account.employees.toLocaleString() },
    ...(canSeeRevenue ? [{ label: 'Annual Revenue', value: formatCurrency(account.revenue), fullWidth: true }] : []),
    { label: 'Industry', value: <Chip label={account.industry} size="small" sx={{ bgcolor: `${color}22`, color, fontWeight: 600 }} /> },
    { label: 'Status', value: <Chip label={account.status} size="small" color={account.status === 'active' ? 'success' : 'default'} /> },
    { label: 'Created', value: formatDate(account.createdAt) },
    { label: 'Updated', value: formatDate(account.updatedAt) },
    { label: 'Account ID', value: account.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={account.name}
      subtitle={account.industry}
      avatar={<Avatar sx={{ bgcolor: color, width: 44, height: 44, fontWeight: 700 }}>{account.name.charAt(0)}</Avatar>}
      status={account.status}
      statusColor={account.status === 'active' ? '#059669' : '#6B7280'}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(account.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(account); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default AccountDetailDrawer;
