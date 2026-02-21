import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, InputAdornment, Button, TablePagination, IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import LeadFormModal from '../components/LeadFormModal';
import LeadDetailDrawer from '../components/LeadDetailDrawer';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import StatusChip from '../../../shared/components/StatusChip';
import EmptyState from '../../../shared/components/EmptyState';
import PageWrapper from '../../../shared/components/PageWrapper';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import WithPermission from '../../../core/role-access/withPermission';
import { useFieldAccess } from '../../../shared/hooks/usePermission';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { formatDate } from '../../../shared/utils/dateUtils';
import { Lead } from '../../../shared/types';
import { LeadFormData } from '../types';

const LeadsPage: React.FC = () => {
  const { leads, createLead, editLead, removeLead, search } = useLeads();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const canSeeScore = useFieldAccess('leads', 'score');
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => leads.slice(page * 10, page * 10 + 10), [leads, page]);

  const handleCreate = useCallback((data: LeadFormData) => createLead(data), [createLead]);

  const handleEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback((data: LeadFormData) => {
    if (editingLead) editLead({ ...editingLead, ...data });
    setEditingLead(null);
  }, [editingLead, editLead]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Lead', 'Are you sure you want to delete this lead? This cannot be undone.', () => removeLead(id));
  }, [confirm, removeLead]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingLead(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Leads</Typography>
        <WithPermission permission="leads:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Lead</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent>
          <TextField size="small" placeholder="Search leads…" value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
            sx={{ mb: 2, width: 280 }}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell><TableCell>Company</TableCell><TableCell>Email</TableCell>
                <TableCell>Source</TableCell>{canSeeScore && <TableCell>Score</TableCell>}<TableCell>Status</TableCell>
                <TableCell>Created</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No leads found" description="Add your first lead to get started." /></TableCell></TableRow>
              ) : paginated.map((lead) => (
                <TableRow key={lead.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerLead(lead)}>
                  <TableCell sx={{ fontWeight: 600 }}>{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  {canSeeScore && <TableCell>{lead.score}</TableCell>}
                  <TableCell><StatusChip label={lead.status} /></TableCell>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="leads:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(lead)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="leads:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(lead.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={leads.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => setPage(p)} />
        </CardContent>
      </Card>
      <LeadFormModal open={modalOpen} onClose={handleModalClose} onSubmit={editingLead ? handleEditSubmit : handleCreate} initialData={editingLead ?? {}} mode={editingLead ? 'edit' : 'create'} />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
      <LeadDetailDrawer lead={drawerLead} open={!!drawerLead} onClose={() => setDrawerLead(null)} onEdit={(l) => { setDrawerLead(null); handleEdit(l); }} onDelete={(id) => { setDrawerLead(null); handleDelete(id); }} />
    </PageWrapper>
  );
};

export default LeadsPage;
