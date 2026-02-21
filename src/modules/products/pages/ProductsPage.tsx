import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, InputAdornment, Button, TablePagination, Chip, Avatar,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Package, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { setProductsPage } from '../../../store/slices/productsSlice';
import { useProducts } from '../hooks/useProducts';
import ProductFormModal from '../components/ProductFormModal';
import ProductDetailDrawer from '../components/ProductDetailDrawer';
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
import { Product } from '../../../shared/types';
import { ProductFormData } from '../types';

const CAT_COLORS: Record<string, string> = {
  Software: '#2563EB', Service: '#059669', 'Add-on': '#F59E0B', Hardware: '#EF4444', Consulting: '#8B5CF6', Other: '#6B7280',
};

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, createProduct, editProduct, removeProduct, search } = useProducts();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const page = useAppSelector((s) => s.products.page);
  const canSeePrice = useFieldAccess('products', 'price');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const paginated = useMemo(() => products.slice(page * 10, page * 10 + 10), [products, page]);

  const handleCreate = useCallback((data: ProductFormData) => createProduct(data), [createProduct]);

  const handleEdit = useCallback((p: Product) => { setEditingProduct(p); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: ProductFormData) => {
    if (editingProduct) editProduct({ ...editingProduct, ...data });
    setEditingProduct(null);
  }, [editingProduct, editProduct]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Product', 'Are you sure you want to delete this product?', () => removeProduct(id));
  }, [confirm, removeProduct]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingProduct(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package size={22} />
          <Typography variant="h5" fontWeight={700}>Products</Typography>
          <Chip label={products.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="products:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Product</Button>
        </WithPermission>
      </Box>
      <Card>
        <CardContent sx={{ p: '0 !important' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField size="small" placeholder="Search products…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
              sx={{ width: 300 }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Category</TableCell>
                {canSeePrice && <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Price/mo</TableCell>}
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No products found" /></TableCell></TableRow>
              ) : paginated.map((p) => (
                <TableRow key={p.id} hover sx={{ cursor: 'pointer' }} onClick={() => setDrawerProduct(p)}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: `${CAT_COLORS[p.category] ?? '#6B7280'}22` }}>
                        <Package size={16} color={CAT_COLORS[p.category] ?? '#6B7280'} />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize={14}>{p.name}</Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{p.description}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={p.sku} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: 11 }} /></TableCell>
                  <TableCell><Chip label={p.category} size="small" sx={{ bgcolor: `${CAT_COLORS[p.category] ?? '#6B7280'}22`, color: CAT_COLORS[p.category] ?? '#6B7280', fontWeight: 600 }} /></TableCell>
                  {canSeePrice && <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>{formatCurrency(p.price)}</TableCell>}
                  <TableCell>{p.stock >= 999 ? '∞' : p.stock}</TableCell>
                  <TableCell><StatusChip label={p.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatDate(p.createdAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <WithPermission permission="products:write">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(p)}><Pencil size={14} /></IconButton>
                      </Tooltip>
                    </WithPermission>
                    <WithPermission permission="products:write">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></IconButton>
                      </Tooltip>
                    </WithPermission>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={products.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]} onPageChange={(_, p) => dispatch(setProductsPage(p))} />
        </CardContent>
      </Card>
      <ProductDetailDrawer product={drawerProduct} open={!!drawerProduct} onClose={() => setDrawerProduct(null)} canSeePrice={canSeePrice} onEdit={(p) => { setDrawerProduct(null); handleEdit(p); }} onDelete={(id) => { setDrawerProduct(null); handleDelete(id); }} />
      <ProductFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingProduct ? handleEditSubmit : handleCreate}
        initialData={editingProduct ?? {}}
        mode={editingProduct ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default ProductsPage;
