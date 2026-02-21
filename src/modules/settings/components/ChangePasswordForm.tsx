import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, LinearProgress,
  CircularProgress, Divider, InputAdornment, IconButton, TextField,
} from '@mui/material';
import { KeyRound, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setPasswordChangeResult, clearPasswordChangeResult } from '../../../store/slices/usersSlice';
import { usersService } from '../../../api/services/usersService';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';

/** Password strength scorer — returns score 0–4 and label/color */
function scorePassword(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const capped = Math.min(s, 4) as 0 | 1 | 2 | 3 | 4;
  const labels: Record<typeof capped, string> = { 0: 'Weak', 1: 'Fair', 2: 'Good', 3: 'Strong', 4: 'Very Strong' };
  const colors: Record<typeof capped, string> = { 0: '#EF4444', 1: '#F59E0B', 2: '#3B82F6', 3: '#10B981', 4: '#10B981' };
  return { score: capped, label: labels[capped], color: colors[capped] };
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoFocus?: boolean;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange, error, autoFocus, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setShow((v) => !v)} tabIndex={-1}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const tenant = useAppSelector(selectCurrentTenant);
  const passwordChangeResult = useAppSelector((s) => s.users.passwordChangeResult);

  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; newPw?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = scorePassword(newPw);

  // React to Redux result
  useEffect(() => {
    if (passwordChangeResult === null) return;

    setLoading(false);

    if (passwordChangeResult === 'ok') {
      setSuccess(true);
      setCurrent(''); setNewPw(''); setConfirm('');
      setErrors({});
      if (tenant && currentUser) {
        dispatch(addAuditLog({
          tenantId: tenant.id,
          userId: currentUser.id,
          action: 'PASSWORD_RESET',
          module: 'settings',
          recordId: currentUser.id,
        }));
      }
    } else if (passwordChangeResult === 'wrong_password') {
      setErrors((p) => ({ ...p, current: 'Current password is incorrect.' }));
    }

    dispatch(clearPasswordChangeResult());
  }, [passwordChangeResult, dispatch, tenant, currentUser]);

  // Auto-hide success message after 4 s
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!current) e.current = 'Current password is required.';
    if (!newPw) {
      e.newPw = 'New password is required.';
    } else if (newPw.length < 8) {
      e.newPw = 'Password must be at least 8 characters.';
    } else if (newPw === current) {
      e.newPw = 'New password must be different from your current password.';
    }
    if (!confirm) {
      e.confirm = 'Please confirm your new password.';
    } else if (newPw !== confirm) {
      e.confirm = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !currentUser) return;
    setLoading(true);
    setSuccess(false);

    try {
      await usersService.changePassword(currentUser.id, {
        currentPassword: current,
        newPassword: newPw,
      });
      dispatch(setPasswordChangeResult('ok'));
    } catch (err: any) {
      if (err.status === 400 || err.status === 401) {
        dispatch(setPasswordChangeResult('wrong_password'));
      } else {
        // Generic failure
        dispatch(setPasswordChangeResult(null));
        setErrors((p) => ({ ...p, current: err.message || 'Failed to update password.' }));
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShieldCheck size={18} />
        <Typography variant="subtitle2" fontWeight={700}>Change Password</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircle size={18} />}
          sx={{ mb: 2 }}
          onClose={() => setSuccess(false)}
        >
          Password updated successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
        {/* Current password */}
        <PasswordInput
          label="Current Password"
          value={current}
          onChange={(v) => { setCurrent(v); setErrors((p) => ({ ...p, current: undefined })); }}
          error={errors.current}
          autoFocus
          autoComplete="current-password"
        />

        {/* New password */}
        <PasswordInput
          label="New Password"
          value={newPw}
          onChange={(v) => { setNewPw(v); setErrors((p) => ({ ...p, newPw: undefined })); }}
          error={errors.newPw}
          autoComplete="new-password"
        />

        {/* Strength meter */}
        {newPw.length > 0 && (
          <Box sx={{ mt: -1 }}>
            <LinearProgress
              variant="determinate"
              value={(strength.score / 4) * 100}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: 2 },
              }}
            />
            <Typography variant="caption" sx={{ color: strength.color }}>
              Strength: {strength.label}
            </Typography>
          </Box>
        )}

        {/* Confirm new password */}
        <PasswordInput
          label="Confirm New Password"
          value={confirm}
          onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: undefined })); }}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <KeyRound size={16} />}
            sx={{ fontWeight: 700 }}
          >
            {loading ? 'Updating…' : 'Update Password'}
          </Button>
          <Button
            variant="text"
            color="inherit"
            onClick={() => {
              setCurrent(''); setNewPw(''); setConfirm(''); setErrors({}); setSuccess(false);
            }}
            disabled={loading}
          >
            Clear
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Use at least 8 characters. Mix letters, numbers and symbols for a stronger password.
        </Typography>
      </Box>
    </Box>
  );
};

export default ChangePasswordForm;
