import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, InputAdornment, Button, TablePagination, Chip,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { setQuotesPage } from '../../../store/slices/quotesSlice';
import { useQuotes } from '../hooks/useQuotes';
import QuoteFormModal from '../components/QuoteFormModal';
import QuoteDetailDrawer from '../components/QuoteDetailDrawer';
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
import { Quote } from '../../../shared/types';
import { QuoteFormData } from '../types';

const QuotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quotes, createQuote, editQuote, removeQuote, search } = useQuotes();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const page = useAppSelector((s) => s.quotes.page);
  const canSeeAmount = useFieldAccess('quotes', 'amount');
  const canSeeValidUntil = useFieldAccess('quotes', 'validUntil');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [drawerQuote, setDrawerQuote] = useState<Quote | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => quotes.slice(page * 10, page * 10 + 10), [quotes, page]);

  const handleCreate = useCallback((data: QuoteFormData) => createQuote(data), [createQuote]);

  const handleEdit = useCallback((q: Quote) => { setEditingQuote(q); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: QuoteFormData) => {
    if (editingQuote) editQuote({ ...editingQuote, ...data });
    setEditingQuote(null);
  }, [editingQuote, editQuote]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Quote', 'Are you sure you want to delete this quote?', () => removeQuote(id));
  }, [confirm, removeQuote]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingQuote(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileText size={22} />
          <Typography variant="h5" fontWeight={700}>Quotes</Typography>
          <Chip label={quotes.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="quotes:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>New Quote</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField size="small" placeholder="Search quotes…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
              sx={{ width: 300 }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Quote #</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Contact</TableCell>
                {canSeeAmount && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Amount</TableCell>}
                {canSeeValidUntil && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Valid Until</TableCell>}
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No quotes found" description="Create your first quote to get started." /></TableCell></TableRow>
              ) : paginated.map((q) => (
                <TableRow key={q.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerQuote(q)}>
                  <TableCell><Chip label={q.number} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: 11 }} /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{q.contactName}</TableCell>
                  {canSeeAmount && <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>{formatCurrency(q.amount)}</TableCell>}
                  {canSeeValidUntil && <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatDate(q.validUntil)}</TableCell>}
                  <TableCell><Chip label={`${q.items.length} items`} size="small" /></TableCell>
                  <TableCell><StatusChip label={q.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatDate(q.createdAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="quotes:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(q)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="quotes:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(q.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={quotes.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => dispatch(setQuotesPage(p))} />
        </CardContent>
      </Card>
      <QuoteDetailDrawer quote={drawerQuote} open={!!drawerQuote} onClose={() => setDrawerQuote(null)} canSeeAmount={canSeeAmount} onEdit={(q) => { setDrawerQuote(null); handleEdit(q); }} onDelete={(id) => { setDrawerQuote(null); handleDelete(id); }} />
      <QuoteFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingQuote ? handleEditSubmit : handleCreate}
        initialData={editingQuote ?? {}}
        mode={editingQuote ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default QuotesPage;
