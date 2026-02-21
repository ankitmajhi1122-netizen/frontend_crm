import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid,
} from '@mui/material';
import { Contact } from '../../../shared/types';
import { ContactFormData } from '../types';

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  initialData?: Partial<Contact>;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM: ContactFormData = {
  firstName: '', lastName: '', email: '', phone: '', company: '', accountId: '', status: 'active',
};

const ContactFormModal: React.FC<ContactFormModalProps> = React.memo(({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState<ContactFormData>({ ...DEFAULT_FORM, ...initialData });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
      <DialogTitle>{mode === 'create' ? 'Add Contact' : 'Edit Contact'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Company" name="company" value={form.company} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.firstName || !form.email}>
          {mode === 'create' ? 'Add Contact' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ContactFormModal.displayName = 'ContactFormModal';
export default ContactFormModal;
