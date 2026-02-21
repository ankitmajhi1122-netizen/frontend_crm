import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Quote, QuoteStatus } from '../../../shared/types';
import { QuoteFormData } from '../types';
import { useAppSelector } from '../../../app/store/hooks';

interface QuoteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteFormData) => void;
  initialData?: Partial<Quote>;
  mode?: 'create' | 'edit';
}

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FORM: QuoteFormData = {
  number: '', contactId: '', contactName: '', dealId: '',
  amount: 0, status: 'draft',
  validUntil: today,
};

const STATUSES: QuoteStatus[] = ['draft', 'sent', 'active', 'done', 'expired'];

const QuoteFormModal: React.FC<QuoteFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<QuoteFormData>({ ...DEFAULT_FORM, ...initialData });

  // Live data from Redux for dropdowns
  const contacts = useAppSelector((s) => s.contacts.items);
  const deals = useAppSelector((s) => s.deals.items);

  useEffect(() => {
    if (open) setForm({ ...DEFAULT_FORM, ...initialData });
  }, [open, initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  }, []);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  }, []);

  // Auto-fill contactName when contact is selected
  const handleContactChange = useCallback((e: SelectChangeEvent) => {
    const contact = contacts.find((c) => c.id === e.target.value);
    setForm((f) => ({
      ...f,
      contactId: e.target.value,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : f.contactName,
    }));
  }, [contacts]);

  const handleSubmit = useCallback(() => {
    onSubmit({ ...form });
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>{mode === 'create' ? 'New Quote' : 'Edit Quote'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Quote #" name="number" value={form.number} onChange={handleChange} required placeholder="QT-2024-001" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Contact</InputLabel>
              <Select value={form.contactId} label="Contact" onChange={handleContactChange}>
                <MenuItem value=""><em>None</em></MenuItem>
                {contacts.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Linked Deal (optional)</InputLabel>
              <Select value={form.dealId} label="Linked Deal (optional)" onChange={handleSelectChange('dealId')}>
                <MenuItem value=""><em>None</em></MenuItem>
                {deals.map((d) => (
                  <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Amount ($)" name="amount" value={form.amount} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Valid Until" name="validUntil" value={form.validUntil} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.number || !form.contactId}>
          {mode === 'create' ? 'Create Quote' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

QuoteFormModal.displayName = 'QuoteFormModal';
export default QuoteFormModal;
