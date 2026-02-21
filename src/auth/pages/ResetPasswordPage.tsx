import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Button, Typography, Alert,
  Divider, CircularProgress, Box, LinearProgress,
} from '@mui/material';
import { KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { loginSuccess } from '../authSlice';
import { addAuditLog } from '../../store/slices/auditSlice';
import { selectCurrentUser } from '../authSelectors';
import { selectCurrentTenant } from '../../multi-tenant/tenantSelectors';
import { ROUTES } from '../../shared/constants/routes';
import AuthLayout from '../components/AuthLayout';
import PasswordField from '../components/PasswordField';
import { authService } from '../../api/services/authService';

/** Password strength scorer (0–4) */
function scorePassword(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const capped = Math.min(score, 4);
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#10B981'];
  return { score: capped, label: labels[capped], color: colors[capped] };
}

const ResetPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const tenant = useAppSelector(selectCurrentTenant);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ new?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');

  const strength = scorePassword(newPassword);

  const validate = (): boolean => {
    const e: { new?: string; confirm?: string } = {};
    if (!newPassword) {
      e.new = 'Please enter a new password.';
    } else if (newPassword.length < 8) {
      e.new = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      e.confirm = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      e.confirm = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !currentUser) return;
    setLoading(true);
    setApiError('');

    // Real backend — force-reset password server-side
    try {
      const updatedUser = await authService.resetPassword({
        userId: currentUser.id,
        currentPassword: '',   // backend allows empty when must_reset_password = true
        newPassword,
      });
      dispatch(loginSuccess(updatedUser));
      if (tenant) {
        dispatch(addAuditLog({
          tenantId: tenant.id, userId: currentUser.id,
          action: 'PASSWORD_RESET', module: 'auth', recordId: currentUser.id,
        }));
      }
      setLoading(false);
      setDone(true);
    } catch (err: unknown) {
      setLoading(false);
      setApiError(err instanceof Error ? err.message : 'Failed to set password');
    }
  };

  const handleContinue = () => navigate(ROUTES.DASHBOARD, { replace: true });

  // If no user is logged in, redirect away
  if (!currentUser) {
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  return (
    <AuthLayout>
      <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {!done ? (
            <>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 42, height: 42, borderRadius: 2, bgcolor: '#2563EB', flexShrink: 0,
                }}>
                  <KeyRound size={20} color="white" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="white" lineHeight={1.2}>
                    Set your password
                  </Typography>
                  <Typography color="rgba(255,255,255,0.4)" fontSize={13}>
                    Hi {currentUser.name.split(' ')[0]} 👋 — create a secure password to continue
                  </Typography>
                </Box>
              </Box>

              <Alert
                severity="info"
                icon={<ShieldCheck size={16} />}
                sx={{ mb: 3, fontSize: 13, bgcolor: 'rgba(37,99,235,0.12)', color: '#93C5FD', border: '1px solid rgba(37,99,235,0.3)' }}
              >
                Your admin assigned you a temporary password. Please set a permanent one now.
              </Alert>

              {apiError && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
                  {apiError}
                </Alert>
              )}

              {/* New password */}
              <PasswordField
                fullWidth
                label="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword((e.target as HTMLInputElement).value);
                  setErrors((p) => ({ ...p, new: undefined }));
                }}
                error={!!errors.new}
                helperText={errors.new}
                sx={{ mb: 1 }}
                autoFocus
                autoComplete="new-password"
              />

              {/* Strength meter */}
              {newPassword.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(strength.score / 4) * 100}
                    sx={{
                      height: 4, borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: 2 },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: strength.color, mt: 0.5, display: 'block' }}>
                    Password strength: {strength.label}
                  </Typography>
                </Box>
              )}

              {/* Confirm password */}
              <PasswordField
                fullWidth
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword((e.target as HTMLInputElement).value);
                  setErrors((p) => ({ ...p, confirm: undefined }));
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                error={!!errors.confirm}
                helperText={errors.confirm}
                sx={{ mb: 3 }}
                autoComplete="new-password"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <KeyRound size={18} />}
                sx={{
                  py: 1.5, fontWeight: 700, fontSize: 15, borderRadius: 2,
                  bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' },
                  '&.Mui-disabled': { bgcolor: 'rgba(37,99,235,0.5)', color: 'rgba(255,255,255,0.5)' },
                }}
              >
                {loading ? 'Saving…' : 'Set Password & Continue'}
              </Button>
            </>
          ) : (
            /* ── Success ── */
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 72, height: 72, borderRadius: '50%',
                bgcolor: 'rgba(16,185,129,0.15)', mb: 2,
              }}>
                <CheckCircle size={36} color="#10B981" />
              </Box>
              <Typography variant="h6" fontWeight={700} color="white" mb={1}>
                Password Set!
              </Typography>
              <Typography color="rgba(255,255,255,0.5)" fontSize={14} mb={3}>
                Your password has been updated. You're all set to use CRM Pro.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleContinue}
                sx={{
                  py: 1.5, fontWeight: 700, borderRadius: 2,
                  bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' },
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography fontSize={12} color="rgba(255,255,255,0.25)" textAlign="center">
            Logged in as <strong style={{ color: 'rgba(255,255,255,0.4)' }}>{currentUser.email}</strong>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
