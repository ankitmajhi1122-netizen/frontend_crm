import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Campaign, CampaignType, CampaignStatus } from '../../../shared/types';
import { CampaignFormData } from '../types';

interface CampaignFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => void;
  initialData?: Partial<Campaign>;
  mode?: 'create' | 'edit';
}

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FORM: CampaignFormData = {
  name: '', type: 'Email', status: 'draft', budget: 0,
  startDate: today, endDate: today,
};

const CAMPAIGN_TYPES: CampaignType[] = ['Email', 'Social', 'Event', 'Referral', 'Other'];
const CAMPAIGN_STATUSES: CampaignStatus[] = ['draft', 'active', 'paused', 'done'];

const CampaignFormModal: React.FC<CampaignFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<CampaignFormData>({ ...DEFAULT_FORM, ...initialData });

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
    onSubmit({ ...form });
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>{mode === 'create' ? 'New Campaign' : 'Edit Campaign'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Campaign Name" name="name" value={form.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={handleSelectChange('type')}>
                {CAMPAIGN_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {CAMPAIGN_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Budget ($)" name="budget" value={form.budget} onChange={handleChange} type="number" inputProps={{ min: 0 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="End Date" name="endDate" value={form.endDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.name}>
          {mode === 'create' ? 'Create Campaign' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

CampaignFormModal.displayName = 'CampaignFormModal';
export default CampaignFormModal;
