import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Lead, LeadStatus, LeadSource } from '../../../shared/types';
import { LeadFormData } from '../types';

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  initialData?: Partial<Lead>;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM: LeadFormData = {
  name: '', email: '', phone: '', company: '', status: 'new', source: 'web', score: 50,
};

const LeadFormModal: React.FC<LeadFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<LeadFormData>({ ...DEFAULT_FORM, ...initialData });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
      <DialogTitle>{mode === 'create' ? 'Add Lead' : 'Edit Lead'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Company" name="company" value={form.company} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {(['new','contacted','qualified','disqualified'] as LeadStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select value={form.source} label="Source" onChange={handleSelectChange('source')}>
                {(['web','referral','email','social','other'] as LeadSource[]).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Score (0–100)" name="score" value={form.score} onChange={handleChange} type="number" inputProps={{ min: 0, max: 100 }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.email}>
          {mode === 'create' ? 'Add Lead' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

LeadFormModal.displayName = 'LeadFormModal';
export default LeadFormModal;
