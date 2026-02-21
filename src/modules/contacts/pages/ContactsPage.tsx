import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, InputAdornment, Button, TablePagination,
  Avatar, IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import ContactFormModal from '../components/ContactFormModal';
import ContactDetailDrawer from '../components/ContactDetailDrawer';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import EmptyState from '../../../shared/components/EmptyState';
import PageWrapper from '../../../shared/components/PageWrapper';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import WithPermission from '../../../core/role-access/withPermission';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { formatDate } from '../../../shared/utils/dateUtils';
import { Contact } from '../../../shared/types';
import { ContactFormData } from '../types';

const ContactsPage: React.FC = () => {
  const { contacts, createContact, editContact, removeContact, search } = useContacts();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => contacts.slice(page * 10, page * 10 + 10), [contacts, page]);

  const handleCreate = useCallback((data: ContactFormData) => createContact(data), [createContact]);

  const handleEdit = useCallback((contact: Contact) => { setEditingContact(contact); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: ContactFormData) => {
    if (editingContact) editContact({ ...editingContact, ...data });
    setEditingContact(null);
  }, [editingContact, editContact]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Contact', 'Are you sure you want to delete this contact?', () => removeContact(id));
  }, [confirm, removeContact]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingContact(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Contacts</Typography>
        <WithPermission permission="contacts:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Contact</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent>
          <TextField size="small" placeholder="Search contacts…" value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
            sx={{ mb: 2, width: 280 }}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone</TableCell>
                <TableCell>Company</TableCell><TableCell>Created</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={6}><EmptyState title="No contacts found" description="Add your first contact to get started." /></TableCell></TableRow>
              ) : paginated.map((c) => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerContact(c)}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{c.firstName.charAt(0)}</Avatar>
                      <Box sx={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</Box>
                    </Box>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.company}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="contacts:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(c)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="contacts:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={contacts.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => setPage(p)} />
        </CardContent>
      </Card>
      <ContactFormModal open={modalOpen} onClose={handleModalClose} onSubmit={editingContact ? handleEditSubmit : handleCreate} initialData={editingContact ?? {}} mode={editingContact ? 'edit' : 'create'} />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
      <ContactDetailDrawer contact={drawerContact} open={!!drawerContact} onClose={() => setDrawerContact(null)} onEdit={(c) => { setDrawerContact(null); handleEdit(c); }} onDelete={(id) => { setDrawerContact(null); handleDelete(id); }} />
    </PageWrapper>
  );
};

export default ContactsPage;
