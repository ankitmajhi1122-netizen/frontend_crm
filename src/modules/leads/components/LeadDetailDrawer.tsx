import React from 'react';
import { Avatar, Button, Chip } from '@mui/material';
import { Mail, Phone, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import { Lead } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';

const SOURCE_COLORS: Record<string, string> = {
  web: '#2563EB', referral: '#059669', email: '#F59E0B', social: '#7C3AED', other: '#6B7280',
};
const STATUS_COLORS: Record<string, string> = {
  new: '#2563EB', contacted: '#F59E0B', qualified: '#059669', disqualified: '#EF4444',
};

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ lead, open, onClose, onEdit, onDelete }) => {
  if (!lead) return null;

  const fields = [
    { label: 'Email', value: <><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{lead.email}</>, fullWidth: true },
    { label: 'Phone', value: <><Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{lead.phone}</> },
    { label: 'Company', value: lead.company },
    { label: 'Source', value: <Chip label={lead.source} size="small" sx={{ bgcolor: `${SOURCE_COLORS[lead.source] ?? '#6B7280'}22`, color: SOURCE_COLORS[lead.source] ?? '#6B7280', fontWeight: 600 }} /> },
    { label: 'Score', value: <Chip label={`${lead.score}/100`} size="small" color={lead.score >= 70 ? 'success' : lead.score >= 40 ? 'warning' : 'error'} /> },
    { label: 'Created', value: formatDate(lead.createdAt) },
    { label: 'Updated', value: formatDate(lead.updatedAt) },
    { label: 'Lead ID', value: lead.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={lead.name}
      subtitle={lead.company}
      avatar={<Avatar sx={{ bgcolor: STATUS_COLORS[lead.status] ?? '#6B7280' }}>{lead.name.charAt(0)}</Avatar>}
      status={lead.status}
      statusColor={STATUS_COLORS[lead.status]}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(lead.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(lead); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default LeadDetailDrawer;
