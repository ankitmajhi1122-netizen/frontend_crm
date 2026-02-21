import React from 'react';
import { Avatar, Button, Chip } from '@mui/material';
import { Mail, Phone, Pencil, Trash2 } from 'lucide-react';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import { Contact } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/dateUtils';

interface ContactDetailDrawerProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({ contact, open, onClose, onEdit, onDelete }) => {
  if (!contact) return null;
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const fields = [
    { label: 'Email', value: <><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{contact.email}</>, fullWidth: true },
    { label: 'Phone', value: <><Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{contact.phone}</> },
    { label: 'Company', value: contact.company },
    { label: 'Status', value: <Chip label={contact.status} size="small" color={contact.status === 'active' ? 'success' : 'default'} /> },
    { label: 'Account ID', value: contact.accountId },
    { label: 'Created', value: formatDate(contact.createdAt) },
    { label: 'Updated', value: formatDate(contact.updatedAt) },
    { label: 'Contact ID', value: contact.id, fullWidth: true },
  ];

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={fullName}
      subtitle={contact.company}
      avatar={<Avatar sx={{ bgcolor: '#2563EB' }}>{contact.firstName.charAt(0)}{contact.lastName.charAt(0)}</Avatar>}
      status={contact.status}
      statusColor={contact.status === 'active' ? '#059669' : '#6B7280'}
      fields={fields}
      actions={
        <>
          <Button size="small" variant="outlined" color="error" startIcon={<Trash2 size={14} />}
            onClick={() => { onDelete(contact.id); onClose(); }}>Delete</Button>
          <Button size="small" variant="contained" startIcon={<Pencil size={14} />}
            onClick={() => { onEdit(contact); onClose(); }}>Edit</Button>
        </>
      }
    />
  );
};

export default ContactDetailDrawer;
