import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, InputAdornment, Button, TablePagination, Avatar, Chip,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Building2, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { setAccountsPage } from '../../../store/slices/accountsSlice';
import { useAccounts } from '../hooks/useAccounts';
import AccountFormModal from '../components/AccountFormModal';
import AccountDetailDrawer from '../components/AccountDetailDrawer';
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
import { Account } from '../../../shared/types';
import { AccountFormData } from '../types';

// Color palette cycles through for any industry found in JSON data — no hardcoded industry names
const INDUSTRY_COLOR_PALETTE = ['#2563EB', '#7C3AED', '#059669', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6'];
const industryColorCache: Record<string, string> = {};
function getIndustryColor(industry: string): string {
  if (!industryColorCache[industry]) {
    const idx = Object.keys(industryColorCache).length % INDUSTRY_COLOR_PALETTE.length;
    industryColorCache[industry] = INDUSTRY_COLOR_PALETTE[idx];
  }
  return industryColorCache[industry];
}

const AccountsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accounts, createAccount, editAccount, removeAccount, search } = useAccounts();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const page = useAppSelector((s) => s.accounts.page);
  const canSeeRevenue = useFieldAccess('accounts', 'revenue');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [drawerAccount, setDrawerAccount] = useState<Account | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => accounts.slice(page * 10, page * 10 + 10), [accounts, page]);

  const handlePageChange = useCallback((_: unknown, p: number) => dispatch(setAccountsPage(p)), [dispatch]);

  const handleCreate = useCallback((data: AccountFormData) => createAccount(data), [createAccount]);

  const handleEdit = useCallback((account: Account) => {
    setEditingAccount(account);
    setModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback((data: AccountFormData) => {
    if (editingAccount) editAccount({ ...editingAccount, ...data });
    setEditingAccount(null);
  }, [editingAccount, editAccount]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Account', 'Are you sure you want to delete this account? This cannot be undone.', () => removeAccount(id));
  }, [confirm, removeAccount]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingAccount(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Building2 size={22} />
          <Typography variant="h5" fontWeight={700}>Accounts</Typography>
          <Chip label={accounts.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="accounts:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Account</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField size="small" placeholder="Search accounts…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
              sx={{ width: 300 }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Industry</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Employees</TableCell>
                {canSeeRevenue && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Revenue</TableCell>}
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No accounts found" description="Add your first account to get started." /></TableCell></TableRow>
              ) : paginated.map((a) => (
                <TableRow key={a.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerAccount(a)}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: getIndustryColor(a.industry), fontSize: 14, fontWeight: 700 }}>
                        {a.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize={14}>{a.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">{a.website}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={a.industry} size="small" sx={{ bgcolor: `${getIndustryColor(a.industry)}22`, color: getIndustryColor(a.industry), fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>{a.employees.toLocaleString()}</TableCell>
                  {canSeeRevenue && <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(a.revenue)}</TableCell>}
                  <TableCell><StatusChip label={a.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatDate(a.createdAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="accounts:write">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(a)}><Pencil size={14} /></IconButton>
                      </Tooltip>
                    </WithPermission>
                    <WithPermission permission="accounts:write">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></IconButton>
                      </Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={accounts.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={handlePageChange} />
        </CardContent>
      </Card>
      <AccountDetailDrawer account={drawerAccount} open={!!drawerAccount} onClose={() => setDrawerAccount(null)} canSeeRevenue={canSeeRevenue} onEdit={(a) => { setDrawerAccount(null); handleEdit(a); }} onDelete={(id) => { setDrawerAccount(null); handleDelete(id); }} />
      <AccountFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingAccount ? handleEditSubmit : handleCreate}
        initialData={editingAccount ?? {}}
        mode={editingAccount ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default AccountsPage;
