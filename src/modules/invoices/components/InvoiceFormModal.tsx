import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Invoice, InvoiceStatus } from '../../../shared/types';
import { InvoiceFormData } from '../types';
import { useAppSelector } from '../../../app/store/hooks';

interface InvoiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  initialData?: Partial<Invoice>;
  mode?: 'create' | 'edit';
}

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FORM: InvoiceFormData = {
  number: '', contactId: '', client: '', amount: 0, tax: 0, total: 0,
  dueDate: today, status: 'draft', quoteId: null,
};

const STATUSES: InvoiceStatus[] = ['draft', 'sent', 'pending', 'paid', 'overdue'];

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<InvoiceFormData>({ ...DEFAULT_FORM, ...initialData });

  // Live data from Redux for dropdowns
  const contacts = useAppSelector((s) => s.contacts.items);
  const quotes = useAppSelector((s) => s.quotes.items);

  useEffect(() => {
    if (open) setForm({ ...DEFAULT_FORM, ...initialData });
  }, [open, initialData]);

  // Auto-calculate total when amount or tax changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => {
      const updated = { ...f, [e.target.name]: val };
      if (e.target.name === 'amount' || e.target.name === 'tax') {
        updated.total = Number(updated.amount) + Number(updated.tax);
      }
      return updated;
    });
  }, []);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  }, []);

  // Auto-fill client when contact is selected
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
      <DialogTitle>{mode === 'create' ? 'New Invoice' : 'Edit Invoice'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Invoice #" name="number" value={form.number} onChange={handleChange} required placeholder="INV-2024-001" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
            <TextField fullWidth label="Amount ($)" name="amount" value={form.amount} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Tax ($)" name="tax" value={form.tax} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Total ($)" name="total" value={form.total} onChange={handleChange} type="number" inputProps={{ min: 0 }} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Due Date" name="dueDate" value={form.dueDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Linked Quote (optional)</InputLabel>
              <Select
                value={form.quoteId ?? ''}
                label="Linked Quote (optional)"
                onChange={(e) => setForm((f) => ({ ...f, quoteId: e.target.value || null }))}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {quotes.map((q) => (
                  <MenuItem key={q.id} value={q.id}>{q.number} — {q.contactName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.number || !form.client}>
          {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

InvoiceFormModal.displayName = 'InvoiceFormModal';
export default InvoiceFormModal;
