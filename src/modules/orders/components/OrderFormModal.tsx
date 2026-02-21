import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Order, OrderStatus } from '../../../shared/types';
import { OrderFormData } from '../types';
import { useAppSelector } from '../../../app/store/hooks';

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
  initialData?: Partial<Order>;
  mode?: 'create' | 'edit';
}

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FORM: OrderFormData = {
  number: '', contactId: '', client: '', items: 1,
  subtotal: 0, tax: 0, total: 0,
  status: 'pending', orderDate: today, deliveryDate: null,
};

const STATUSES: OrderStatus[] = ['pending', 'in_progress', 'done', 'cancelled'];

const OrderFormModal: React.FC<OrderFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<OrderFormData>({ ...DEFAULT_FORM, ...initialData });

  const contacts = useAppSelector((s) => s.contacts.items);

  useEffect(() => {
    if (open) setForm({ ...DEFAULT_FORM, ...initialData });
  }, [open, initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => {
      const updated = { ...f, [e.target.name]: val };
      if (e.target.name === 'subtotal' || e.target.name === 'tax') {
        updated.total = Number(updated.subtotal) + Number(updated.tax);
      }
      return updated;
    });
  }, []);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  }, []);

  const handleContactChange = useCallback((e: SelectChangeEvent) => {
    const contact = contacts.find((c) => c.id === e.target.value);
    setForm((f) => ({
      ...f,
      contactId: e.target.value,
      client: contact ? `${contact.firstName} ${contact.lastName}` : f.client,
    }));
  }, [contacts]);

  const handleSubmit = useCallback(() => {
    onSubmit({ ...form });
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>{mode === 'create' ? 'New Order' : 'Edit Order'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Order #" name="number" value={form.number} onChange={handleChange} required placeholder="ORD-2024-001" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Contact (Client)</InputLabel>
              <Select value={form.contactId} label="Contact (Client)" onChange={handleContactChange}>
                <MenuItem value=""><em>None</em></MenuItem>
                {contacts.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Number of Items" name="items" value={form.items} onChange={handleChange} type="number" inputProps={{ min: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Subtotal ($)" name="subtotal" value={form.subtotal} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Tax ($)" name="tax" value={form.tax} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Total ($)" name="total" value={form.total} InputProps={{ readOnly: true }} type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Order Date" name="orderDate" value={form.orderDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Delivery Date (optional)" name="deliveryDate" value={form.deliveryDate ?? ''} onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value || null }))} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.number || !form.client}>
          {mode === 'create' ? 'Create Order' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

OrderFormModal.displayName = 'OrderFormModal';
export default OrderFormModal;
