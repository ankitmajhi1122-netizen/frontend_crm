import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card, CardContent, TextField, Button, Typography,
  Alert, Divider, CircularProgress, Box,
} from '@mui/material';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../../api/services/authService';

const inputSx = {
  '.MuiOutlinedInput-root': {
    color: 'white',
    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
  },
  '.MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '.MuiInputLabel-root.Mui-focused': { color: '#60A5FA' },
  '.MuiFormHelperText-root': { color: '#F87171' },
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setErrorMsg('');
    setLoading(true);

    // Real backend — sends reset email via SMTP
    try {
      await authService.forgotPassword(email.trim());
    } catch {
      // Always show success for security
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <AuthLayout>
      <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {!sent ? (
            <>
              <Typography variant="h6" fontWeight={700} color="white" mb={0.5}>
                Forgot your password?
              </Typography>
              <Typography color="rgba(255,255,255,0.4)" fontSize={13} mb={3}>
                Enter your email and we'll send you a reset link.
              </Typography>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
                  {errorMsg}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Work Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                onKeyDown={handleKeyDown}
                error={!!emailError}
                helperText={emailError}
                sx={{ ...inputSx, mb: 3 }}
                autoFocus
                autoComplete="email"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Mail size={18} />}
                sx={{
                  py: 1.5, fontWeight: 700, fontSize: 15, borderRadius: 2,
                  bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' },
                  '&.Mui-disabled': { bgcolor: 'rgba(37,99,235,0.5)', color: 'rgba(255,255,255,0.5)' },
                }}
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: '50%',
                bgcolor: 'rgba(16,185,129,0.15)', mb: 2,
              }}>
                <CheckCircle size={32} color="#10B981" />
              </Box>
              <Typography variant="h6" fontWeight={700} color="white" mb={1}>
                Check your inbox
              </Typography>
              <Typography color="rgba(255,255,255,0.4)" fontSize={13} mb={3}>
                If an account exists for <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</strong>,
                you'll receive a password reset email shortly.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => { setSent(false); setEmail(''); }}
                sx={{
                  color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.05)' },
                  fontSize: 13, textTransform: 'none',
                }}
              >
                Try a different email
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

          <RouterLink to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <ArrowLeft size={14} color="rgba(255,255,255,0.4)" />
              <Typography fontSize={13} color="rgba(255,255,255,0.4)" sx={{ '&:hover': { color: '#60A5FA' } }}>
                Back to Sign In
              </Typography>
            </Box>
          </RouterLink>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
