import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, InputAdornment, Button, TablePagination, Chip,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { setOrdersPage } from '../../../store/slices/ordersSlice';
import { useOrders } from '../hooks/useOrders';
import OrderFormModal from '../components/OrderFormModal';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
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
import { Order } from '../../../shared/types';
import { OrderFormData } from '../types';

const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, createOrder, editOrder, removeOrder, search } = useOrders();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const page = useAppSelector((s) => s.orders.page);
  const canSeeTotal = useFieldAccess('orders', 'total');
  const canSeeStatus = useFieldAccess('orders', 'status');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => orders.slice(page * 10, page * 10 + 10), [orders, page]);
  const totalRevenue = useMemo(() => orders.filter((o) => o.status === 'done').reduce((s, o) => s + o.total, 0), [orders]);
  const pending = useMemo(() => orders.filter((o) => o.status === 'pending' || o.status === 'in_progress').length, [orders]);

  const handleCreate = useCallback((data: OrderFormData) => createOrder(data), [createOrder]);

  const handleEdit = useCallback((o: Order) => { setEditingOrder(o); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: OrderFormData) => {
    if (editingOrder) editOrder({ ...editingOrder, ...data });
    setEditingOrder(null);
  }, [editingOrder, editOrder]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Order', 'Are you sure you want to delete this order?', () => removeOrder(id));
  }, [confirm, removeOrder]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingOrder(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart size={22} />
          <Typography variant="h5" fontWeight={700}>Orders</Typography>
          <Chip label={orders.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="orders:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>New Order</Button>
        </WithPermission>
      </Box>
      {canSeeTotal && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Revenue (Delivered)</Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">{formatCurrency(totalRevenue)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Pending Orders</Typography>
              <Typography variant="h6" fontWeight={700} color="warning.main">{pending}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField size="small" placeholder="Search orders…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
              sx={{ width: 300 }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Items</TableCell>
                {canSeeTotal && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Subtotal</TableCell>}
                {canSeeTotal && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Total</TableCell>}
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Order Date</TableCell>
                {canSeeStatus && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>}
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No orders found" description="Create your first order to get started." /></TableCell></TableRow>
              ) : paginated.map((o) => (
                <TableRow key={o.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerOrder(o)}>
                  <TableCell><Chip label={o.number} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: 11 }} /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{o.client}</TableCell>
                  <TableCell>{o.items}</TableCell>
                  {canSeeTotal && <TableCell>{formatCurrency(o.subtotal)}</TableCell>}
                  {canSeeTotal && <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>{formatCurrency(o.total)}</TableCell>}
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatDate(o.orderDate)}</TableCell>
                  {canSeeStatus && <TableCell><StatusChip label={o.status} /></TableCell>}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="orders:write">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(o)}><Pencil size={14} /></IconButton></Tooltip>
                    </WithPermission>
                    <WithPermission permission="orders:write">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(o.id)}><Trash2 size={14} /></IconButton></Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={orders.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => dispatch(setOrdersPage(p))} />
        </CardContent>
      </Card>
      <OrderDetailDrawer order={drawerOrder} open={!!drawerOrder} onClose={() => setDrawerOrder(null)} canSeeTotal={canSeeTotal} onEdit={(o) => { setDrawerOrder(null); handleEdit(o); }} onDelete={(id) => { setDrawerOrder(null); handleDelete(id); }} />
      <OrderFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingOrder ? handleEditSubmit : handleCreate}
        initialData={editingOrder ?? {}}
        mode={editingOrder ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default OrdersPage;
