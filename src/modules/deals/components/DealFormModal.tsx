import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Deal, DealStage, DealStatus } from '../../../shared/types';
import { DealFormData } from '../types';

interface DealFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DealFormData) => void;
  initialData?: Partial<Deal>;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM: DealFormData = {
  title: '', contactId: '', accountId: '', stage: 'discovery',
  value: 0, margin: 0, cost: 0, revenue: 0, probability: 50,
  closeDate: new Date().toISOString().split('T')[0], status: 'active',
};

const DealFormModal: React.FC<DealFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<DealFormData>({ ...DEFAULT_FORM, ...initialData });

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

  const handleSubmit = useCallback(() => {
    onSubmit({ ...form, revenue: form.value });
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>{mode === 'create' ? 'Add Deal' : 'Edit Deal'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Stage</InputLabel>
              <Select value={form.stage} label="Stage" onChange={handleSelectChange('stage')}>
                {(['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as DealStage[]).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {(['active', 'won', 'lost'] as DealStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Value ($)" name="value" value={form.value} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Probability (%)" name="probability" value={form.probability} onChange={handleChange} type="number" inputProps={{ min: 0, max: 100 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Margin (%)" name="margin" value={form.margin} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Close Date" name="closeDate" value={form.closeDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.title}>
          {mode === 'create' ? 'Add Deal' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

DealFormModal.displayName = 'DealFormModal';
export default DealFormModal;
