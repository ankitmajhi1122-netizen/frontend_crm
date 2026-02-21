import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Account } from '../../../shared/types';
import { AccountFormData } from '../types';

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void;
  initialData?: Partial<Account>;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM: AccountFormData = {
  name: '', industry: '', website: '', phone: '', email: '',
  revenue: 0, employees: 0, status: 'active',
};

const INDUSTRIES = ['Technology', 'Cloud Services', 'SaaS', 'Startup', 'Analytics', 'Finance', 'Healthcare', 'Retail', 'Other'];

const AccountFormModal: React.FC<AccountFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<AccountFormData>({ ...DEFAULT_FORM, ...initialData });

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
      <DialogTitle>{mode === 'create' ? 'Add Account' : 'Edit Account'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Account Name" name="name" value={form.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select value={form.industry} label="Industry" onChange={handleSelectChange('industry')}>
                {INDUSTRIES.map((ind) => (
                  <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Employees" name="employees" value={form.employees} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Annual Revenue ($)" name="revenue" value={form.revenue} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name || !form.industry}>
          {mode === 'create' ? 'Add Account' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

AccountFormModal.displayName = 'AccountFormModal';
export default AccountFormModal;
