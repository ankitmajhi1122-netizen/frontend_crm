import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Product } from '../../../shared/types';
import { ProductFormData } from '../types';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<Product>;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM: ProductFormData = {
  name: '', sku: '', price: 0, category: 'Software',
  description: '', stock: 999, status: 'active',
};

const CATEGORIES = ['Software', 'Service', 'Add-on', 'Hardware', 'Consulting', 'Other'];

const ProductFormModal: React.FC<ProductFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<ProductFormData>({ ...DEFAULT_FORM, ...initialData });

  React.useEffect(() => {
    if (open) setForm({ ...DEFAULT_FORM, ...initialData });
  }, [open, initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  }, []);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(form);
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>{mode === 'create' ? 'Add Product' : 'Edit Product'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Product Name" name="name" value={form.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="SKU" name="sku" value={form.sku} onChange={handleChange} required placeholder="e.g. CRM-001" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={handleSelectChange('category')}>
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Price ($)" name="price" value={form.price} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.sku}>
          {mode === 'create' ? 'Add Product' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ProductFormModal.displayName = 'ProductFormModal';
export default ProductFormModal;
