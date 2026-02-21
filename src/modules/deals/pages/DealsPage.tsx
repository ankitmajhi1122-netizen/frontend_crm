import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, InputAdornment, Button, TablePagination, IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useDeals } from '../hooks/useDeals';
import DealFormModal from '../components/DealFormModal';
import DealDetailDrawer from '../components/DealDetailDrawer';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import StatusChip from '../../../shared/components/StatusChip';
import EmptyState from '../../../shared/components/EmptyState';
import PageWrapper from '../../../shared/components/PageWrapper';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import WithPermission from '../../../core/role-access/withPermission';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useFieldAccess } from '../../../shared/hooks/usePermission';
import { formatCurrency } from '../../../shared/utils/currencyUtils';
import { formatDate } from '../../../shared/utils/dateUtils';
import { Deal } from '../../../shared/types';
import { DealFormData } from '../types';

const DealsPage: React.FC = () => {
  const { deals, createDeal, editDeal, removeDeal, search } = useDeals();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [drawerDeal, setDrawerDeal] = useState<Deal | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const canSeeMargin = useFieldAccess('deals', 'margin');
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => deals.slice(page * 10, page * 10 + 10), [deals, page]);

  const handleCreate = useCallback((data: DealFormData) => createDeal(data), [createDeal]);

  const handleEdit = useCallback((deal: Deal) => { setEditingDeal(deal); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: DealFormData) => {
    if (editingDeal) editDeal({ ...editingDeal, ...data });
    setEditingDeal(null);
  }, [editingDeal, editDeal]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Deal', 'Are you sure you want to delete this deal?', () => removeDeal(id));
  }, [confirm, removeDeal]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingDeal(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Deals</Typography>
        <WithPermission permission="deals:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Deal</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent>
          <TextField size="small" placeholder="Search deals…" value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
            sx={{ mb: 2, width: 280 }}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell><TableCell>Stage</TableCell><TableCell>Value</TableCell>
                {canSeeMargin && <TableCell>Margin</TableCell>}
                <TableCell>Probability</TableCell><TableCell>Close Date</TableCell>
                <TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No deals found" description="Add your first deal to get started." /></TableCell></TableRow>
              ) : paginated.map((d) => (
                <TableRow key={d.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerDeal(d)}>
                  <TableCell sx={{ fontWeight: 600 }}>{d.title}</TableCell>
                  <TableCell><StatusChip label={d.stage} /></TableCell>
                  <TableCell>{formatCurrency(d.value)}</TableCell>
                  {canSeeMargin && <TableCell>{d.margin}%</TableCell>}
                  <TableCell>{d.probability}%</TableCell>
                  <TableCell>{formatDate(d.closeDate)}</TableCell>
                  <TableCell><StatusChip label={d.status} /></TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="deals:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(d)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="deals:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(d.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={deals.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => setPage(p)} />
        </CardContent>
      </Card>
      <DealFormModal open={modalOpen} onClose={handleModalClose} onSubmit={editingDeal ? handleEditSubmit : handleCreate} initialData={editingDeal ?? {}} mode={editingDeal ? 'edit' : 'create'} />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
      <DealDetailDrawer deal={drawerDeal} open={!!drawerDeal} onClose={() => setDrawerDeal(null)} canSeeMargin={canSeeMargin} onEdit={(d) => { setDrawerDeal(null); handleEdit(d); }} onDelete={(id) => { setDrawerDeal(null); handleDelete(id); }} />
    </PageWrapper>
  );
};

export default DealsPage;
