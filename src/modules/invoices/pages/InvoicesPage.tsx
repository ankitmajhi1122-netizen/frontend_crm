import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, InputAdornment, Button, TablePagination, Chip,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Receipt, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { setInvoicesPage } from '../../../store/slices/invoicesSlice';
import { useInvoices } from '../hooks/useInvoices';
import InvoiceFormModal from '../components/InvoiceFormModal';
import InvoiceDetailDrawer from '../components/InvoiceDetailDrawer';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import { useFieldAccess } from '../../../shared/hooks/usePermission';
import { formatCurrency } from '../../../shared/utils/currencyUtils';
import { formatDate } from '../../../shared/utils/dateUtils';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import PageWrapper from '../../../shared/components/PageWrapper';
import StatusChip from '../../../shared/components/StatusChip';
import EmptyState from '../../../shared/components/EmptyState';
import WithPermission from '../../../core/role-access/withPermission';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { Invoice } from '../../../shared/types';
import { InvoiceFormData } from '../types';

const InvoicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices, createInvoice, editInvoice, removeInvoice, search } = useInvoices();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const page = useAppSelector((s) => s.invoices.page);
  const canSeeAmount = useFieldAccess('invoices', 'amount');
  const canSeeStatus = useFieldAccess('invoices', 'status');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [drawerInvoice, setDrawerInvoice] = useState<Invoice | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => invoices.slice(page * 10, page * 10 + 10), [invoices, page]);

  const totalPaid = useMemo(() => invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0), [invoices]);
  const totalPending = useMemo(() => invoices.filter((i) => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.total, 0), [invoices]);

  const handleCreate = useCallback((data: InvoiceFormData) => createInvoice(data), [createInvoice]);

  const handleEdit = useCallback((inv: Invoice) => { setEditingInvoice(inv); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: InvoiceFormData) => {
    if (editingInvoice) editInvoice({ ...editingInvoice, ...data });
    setEditingInvoice(null);
  }, [editingInvoice, editInvoice]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Invoice', 'Are you sure you want to delete this invoice?', () => removeInvoice(id));
  }, [confirm, removeInvoice]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingInvoice(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt size={22} />
          <Typography variant="h5" fontWeight={700}>Invoices</Typography>
          <Chip label={invoices.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="invoices:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>New Invoice</Button>
        </WithPermission>
      </Box>
      {canSeeAmount && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Collected</Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">{formatCurrency(totalPaid)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Outstanding</Typography>
              <Typography variant="h6" fontWeight={700} color="error.main">{formatCurrency(totalPending)}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField size="small" placeholder="Search invoices…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
              sx={{ width: 300 }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Client</TableCell>
                {canSeeAmount && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Amount</TableCell>}
                {canSeeAmount && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Tax</TableCell>}
                {canSeeAmount && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Total</TableCell>}
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Due Date</TableCell>
                {canSeeStatus && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>}
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No invoices found" description="Create your first invoice to get started." /></TableCell></TableRow>
              ) : paginated.map((inv) => (
                <TableRow key={inv.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerInvoice(inv)}>
                  <TableCell><Chip label={inv.number} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: 11 }} /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{inv.client}</TableCell>
                  {canSeeAmount && <TableCell>{formatCurrency(inv.amount)}</TableCell>}
                  {canSeeAmount && <TableCell sx={{ color: 'text.secondary' }}>{formatCurrency(inv.tax)}</TableCell>}
                  {canSeeAmount && <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>{formatCurrency(inv.total)}</TableCell>}
                  <TableCell sx={{ color: inv.status === 'overdue' ? 'error.main' : 'text.secondary', fontSize: 13 }}>{formatDate(inv.dueDate)}</TableCell>
                  {canSeeStatus && <TableCell><StatusChip label={inv.status} /></TableCell>}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="invoices:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(inv)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="invoices:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(inv.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={invoices.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => dispatch(setInvoicesPage(p))} />
        </CardContent>
      </Card>
      <InvoiceDetailDrawer invoice={drawerInvoice} open={!!drawerInvoice} onClose={() => setDrawerInvoice(null)} canSeeAmount={canSeeAmount} onEdit={(inv) => { setDrawerInvoice(null); handleEdit(inv); }} onDelete={(id) => { setDrawerInvoice(null); handleDelete(id); }} />
      <InvoiceFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingInvoice ? handleEditSubmit : handleCreate}
        initialData={editingInvoice ?? {}}
        mode={editingInvoice ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default InvoicesPage;
