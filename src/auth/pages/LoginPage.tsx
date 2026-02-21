import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Checkbox, FormControlLabel, Divider, CircularProgress,
} from '@mui/material';
import { LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { loginStart, loginSuccess, loginFailure, clearAuthError } from '../authSlice';
import { setTenant } from '../../multi-tenant/tenantSlice';
import { addAuditLog } from '../../store/slices/auditSlice';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../authSelectors';
import { ROUTES } from '../../shared/constants/routes';
import AuthLayout from '../components/AuthLayout';
import PasswordField from '../components/PasswordField';
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

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearAuthError()); };
  }, [dispatch]);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    dispatch(loginStart());

    try {
      const { user, tenant, accessToken: _token } = await authService.login(email.trim(), password);
      if (rememberMe) {
        localStorage.setItem('crm_remember_email', email.trim());
      } else {
        localStorage.removeItem('crm_remember_email');
      }
      dispatch(loginSuccess(user));
      dispatch(setTenant(tenant));
      dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'LOGIN', module: 'auth' }));
      if ((user as any).mustResetPassword) {
        navigate(ROUTES.RESET_PASSWORD, { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(msg));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  // Pre-fill remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('crm_remember_email');
    if (remembered) { setEmail(remembered); setRememberMe(true); }
  }, []);

  return (
    <AuthLayout>
      <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} color="white" mb={0.5}>
            Sign in to your account
          </Typography>
          <Typography color="rgba(255,255,255,0.4)" fontSize={13} mb={3}>
            Enter your credentials to continue
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 13 }} onClose={() => dispatch(clearAuthError())}>
              {authError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
            onKeyDown={handleKeyDown}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            sx={{ ...inputSx, mb: 2 }}
            autoComplete="email"
            autoFocus
          />

          <PasswordField
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => { setPassword((e.target as HTMLInputElement).value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
            onKeyDown={handleKeyDown}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            sx={{ mb: 1 }}
            autoComplete="current-password"
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#2563EB' } }}
                />
              }
              label={
                <Typography fontSize={13} color="rgba(255,255,255,0.5)">Remember me</Typography>
              }
            />
            <RouterLink to={ROUTES.FORGOT_PASSWORD} style={{ textDecoration: 'none' }}>
              <Typography fontSize={13} color="#60A5FA" sx={{ '&:hover': { color: '#93C5FD' } }}>
                Forgot password?
              </Typography>
            </RouterLink>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LogIn size={18} />}
            sx={{
              py: 1.5, fontWeight: 700, fontSize: 15, borderRadius: 2,
              bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' },
              '&.Mui-disabled': { bgcolor: 'rgba(37,99,235,0.5)', color: 'rgba(255,255,255,0.5)' },
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography fontSize={13} color="rgba(255,255,255,0.4)" textAlign="center">
            Don't have an account?{' '}
            <RouterLink to={ROUTES.SIGNUP} style={{ textDecoration: 'none' }}>
              <Typography component="span" fontSize={13} color="#60A5FA" sx={{ '&:hover': { color: '#93C5FD' } }}>
                Sign up
              </Typography>
            </RouterLink>
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
          <Typography fontSize={11} color="rgba(255,255,255,0.2)" textAlign="center">
            Demo accounts: <strong style={{ color: 'rgba(255,255,255,0.35)' }}>alice@acme.crm.io</strong> / <strong style={{ color: 'rgba(255,255,255,0.35)' }}>password123</strong>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
