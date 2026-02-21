import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import { Task, TaskPriority, TaskStatus } from '../../../shared/types';
import { TaskFormData } from '../types';
import { useAppSelector } from '../../../app/store/hooks';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<Task>;
  mode?: 'create' | 'edit';
}

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FORM: TaskFormData = {
  title: '', description: '', dueDate: today,
  priority: 'medium', status: 'open',
  assignedTo: '', relatedTo: '',
};

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['open', 'in_progress', 'done'];

const TaskFormModal: React.FC<TaskFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<TaskFormData>({ ...DEFAULT_FORM, ...initialData });

  // Pull live users, leads, and deals from Redux store for dropdowns
  const users = useAppSelector((s) => s.users.items);
  const leads = useAppSelector((s) => s.leads.items);
  const deals = useAppSelector((s) => s.deals.items);

  useEffect(() => {
    if (open) setForm({ ...DEFAULT_FORM, ...initialData });
  }, [open, initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }, []);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit({ ...form });
    setForm(DEFAULT_FORM);
    onClose();
  }, [form, onSubmit, onClose]);

  // Build related-to options: leads + deals with labels
  const relatedOptions = [
    ...leads.map((l) => ({ id: l.id, label: `Lead: ${l.name}` })),
    ...deals.map((d) => ({ id: d.id, label: `Deal: ${d.title}` })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>{mode === 'create' ? 'Add Activity' : 'Edit Activity'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={2} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={form.priority} label="Priority" onChange={handleSelectChange('priority')}>
                {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleSelectChange('status')}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Due Date" name="dueDate" value={form.dueDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select value={form.assignedTo} label="Assigned To" onChange={handleSelectChange('assignedTo')}>
                <MenuItem value=""><em>None</em></MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.name} ({u.role})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Related To</InputLabel>
              <Select value={form.relatedTo} label="Related To" onChange={handleSelectChange('relatedTo')}>
                <MenuItem value=""><em>None</em></MenuItem>
                {relatedOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.title}>
          {mode === 'create' ? 'Add Activity' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

TaskFormModal.displayName = 'TaskFormModal';
export default TaskFormModal;
