import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Box, Typography, Alert, Chip, IconButton, Tooltip, Divider,
  CircularProgress, SelectChangeEvent,
} from '@mui/material';
import { UserPlus, Copy, CheckCheck, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addUser, ManagedUser } from '../../../store/slices/usersSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectCurrentTenant, selectCurrentSubscription } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { UserRole } from '../../../shared/types';
import { usersService } from '../../../api/services/usersService';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'SALES', label: 'Sales Rep', description: 'Can manage own leads, contacts & deals' },
  { value: 'MANAGER', label: 'Manager', description: 'Full CRM access, view all team data' },
  { value: 'ADMIN', label: 'Admin', description: 'Full access including settings & billing' },
];

const ROLE_COLORS: Record<UserRole, 'default' | 'warning' | 'error'> = {
  SALES: 'default',
  MANAGER: 'warning',
  ADMIN: 'error',
};

/** Generates a readable temporary password */
function generateTempPassword(): string {
  const adjectives = ['Blue', 'Fast', 'Bold', 'Cool', 'Wise', 'Keen', 'Sharp', 'Bright'];
  const nouns = ['Tiger', 'Eagle', 'Storm', 'River', 'Comet', 'Spark', 'Cloud', 'Rock'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}${noun}${num}!`;
}


interface Props {
  open: boolean;
  onClose: () => void;
  existingEmails: string[];
  currentUserCount: number;
}

const AddEmployeeModal: React.FC<Props> = ({ open, onClose, existingEmails, currentUserCount }) => {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector(selectCurrentTenant);
  const currentUser = useAppSelector(selectCurrentUser);
  const subscription = useAppSelector(selectCurrentSubscription);

  const maxUsers = subscription?.maxUsers ?? 5;
  const atLimit = currentUserCount >= maxUsers;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('SALES');
  const [tempPassword, setTempPassword] = useState(() => generateTempPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<ManagedUser | null>(null);

  const validate = (): boolean => {
    const e: { name?: string; email?: string } = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) {
      e.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Enter a valid email address.';
    } else if (existingEmails.includes(email.trim().toLowerCase())) {
      e.email = 'An account with this email already exists.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate() || !tenant || !currentUser) return;
    setLoading(true);
    setErrors({});

    try {
      const newUser = await usersService.create({
        tenantId: tenant.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        password: tempPassword,
        mustResetPassword: true,
      });

      dispatch(addUser({ ...newUser, mustResetPassword: true }));
      dispatch(addAuditLog({
        tenantId: tenant.id,
        userId: currentUser.id,
        action: 'USER_CREATED',
        module: 'settings',
        recordId: newUser.id,
        meta: { name: newUser.name, email: newUser.email, role: newUser.role },
      }));
      setSuccess({ ...newUser, mustResetPassword: true });
    } catch (err: any) {
      setErrors({ email: err.response?.data?.detail || err.message || 'Failed to add employee' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRole('SALES');
    setTempPassword(generateTempPassword());
    setShowPassword(false);
    setCopied(false);
    setErrors({});
    setLoading(false);
    setSuccess(null);
    onClose();
  };

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 2, bgcolor: 'primary.main',
          }}>
            <UserPlus size={18} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>Add Employee</Typography>
            <Typography variant="caption" color="text.secondary">
              Set up login credentials — they'll be prompted to reset on first login
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {atLimit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            User limit reached ({maxUsers} users on your plan). Upgrade to add more employees.
          </Alert>
        )}

        {!success ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Name */}
            <TextField
              label="Full Name"
              fullWidth
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g. John Smith"
              autoFocus
              disabled={atLimit}
            />

            {/* Email */}
            <TextField
              label="Work Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="e.g. john@yourcompany.com"
              disabled={atLimit}
            />

            {/* Role */}
            <FormControl fullWidth disabled={atLimit}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e: SelectChangeEvent) => setRole(e.target.value as UserRole)}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={r.label} size="small" color={ROLE_COLORS[r.value]} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{r.description}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Role summary */}
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={selectedRole.label} size="small" color={ROLE_COLORS[role]} />
              <Typography variant="caption" color="text.secondary">{selectedRole.description}</Typography>
            </Box>

            {/* Temp password */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                Temporary Password
              </Typography>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1.5, py: 1,
                bgcolor: 'background.default',
              }}>
                <Typography
                  fontFamily="monospace"
                  fontSize={15}
                  fontWeight={600}
                  sx={{ flex: 1, letterSpacing: 1 }}
                >
                  {showPassword ? tempPassword : '•'.repeat(tempPassword.length)}
                </Typography>
                <Tooltip title={showPassword ? 'Hide' : 'Show'}>
                  <IconButton size="small" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Regenerate">
                  <IconButton size="small" onClick={() => setTempPassword(generateTempPassword())}>
                    <RefreshCw size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton size="small" onClick={handleCopy} color={copied ? 'success' : 'default'}>
                    {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Share this with the employee. They'll be asked to change it on first login.
              </Typography>
            </Box>
          </Box>
        ) : (
          /* ── Success state ── */
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', mb: 2,
            }}>
              <CheckCheck size={32} color="white" />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={0.5}>Employee Added!</Typography>
            <Typography color="text.secondary" fontSize={14} mb={3}>
              <strong>{success.name}</strong> has been added as a <strong>{success.role}</strong>.
            </Typography>

            <Box sx={{
              bgcolor: 'action.hover', borderRadius: 2, p: 2, textAlign: 'left', mb: 2,
            }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                SHARE THESE CREDENTIALS
              </Typography>
              <Typography fontSize={13} mb={0.5}><strong>Email:</strong> {success.email}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography fontSize={13}><strong>Password:</strong></Typography>
                <Typography fontFamily="monospace" fontSize={13} fontWeight={600}>{success.password}</Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy password'}>
                  <IconButton size="small" onClick={handleCopy} color={copied ? 'success' : 'default'}>
                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Alert severity="info" sx={{ textAlign: 'left', fontSize: 13 }}>
              They'll be prompted to <strong>set their own password</strong> the first time they log in.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {!success ? (
          <>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={loading || atLimit}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <UserPlus size={16} />}
              sx={{ fontWeight: 700 }}
            >
              {loading ? 'Adding…' : 'Add Employee'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => {
              setName(''); setEmail(''); setRole('SALES');
              setTempPassword(generateTempPassword());
              setShowPassword(false); setCopied(false);
              setErrors({}); setLoading(false); setSuccess(null);
            }} variant="outlined">
              Add Another
            </Button>
            <Button variant="contained" onClick={handleClose} sx={{ fontWeight: 700 }}>
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;
