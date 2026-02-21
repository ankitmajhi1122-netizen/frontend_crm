import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Checkbox, FormControlLabel, Divider, CircularProgress,
  ToggleButtonGroup, ToggleButton, LinearProgress,
} from '@mui/material';
import { UserPlus, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { loginStart, loginSuccess, loginFailure, clearAuthError } from '../authSlice';
import { setTenant } from '../../multi-tenant/tenantSlice';
import { addAuditLog } from '../../store/slices/auditSlice';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../authSelectors';
import { ROUTES } from '../../shared/constants/routes';
import { Plan } from '../../shared/types';
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

interface PlanFeature {
  label: string;
  plans: Plan[];
}

const PLAN_FEATURES: PlanFeature[] = [
  { label: 'Dashboard, Leads, Contacts, Deals', plans: ['basic', 'pro', 'enterprise'] },
  { label: 'Accounts, Activities, Campaigns, Products', plans: ['pro', 'enterprise'] },
  { label: 'Quotes, Reports, Settings', plans: ['pro', 'enterprise'] },
  { label: 'Invoices, Orders, Forecasting', plans: ['enterprise'] },
];

const PLAN_LABELS: Record<Plan, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const PLAN_SUBTITLES: Record<Plan, string> = {
  basic: 'Free · Up to 5 users',
  pro: '$49/mo · Up to 20 users',
  enterprise: '$199/mo · Unlimited',
};

const getPasswordStrength = (pw: string): number => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (/[A-Z]/.test(pw)) score += 25;
  if (/[0-9]/.test(pw)) score += 25;
  if (/[^A-Za-z0-9]/.test(pw)) score += 25;
  return score;
};

const strengthLabel = (score: number) => {
  if (score <= 0) return { label: '', color: '#374151' };
  if (score <= 25) return { label: 'Weak', color: '#EF4444' };
  if (score <= 50) return { label: 'Fair', color: '#F59E0B' };
  if (score <= 75) return { label: 'Good', color: '#3B82F6' };
  return { label: 'Strong', color: '#10B981' };
};

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  // Live Redux store — includes admin-created employees
  const allUsers = useAppSelector((s) => s.users.items);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [plan, setPlan] = useState<Plan>('basic');
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearAuthError()); };
  }, [dispatch]);

  const pwStrength = getPasswordStrength(password);
  const { label: strengthText, color: strengthColor } = strengthLabel(pwStrength);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    else if (fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters.';

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    } else {
      // Check against live Redux store so admin-created employees are included
      const existing = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) errors.email = 'An account with this email already exists.';
    }

    if (!company.trim()) errors.company = 'Company name is required.';

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreed) errors.agreed = 'You must accept the terms to continue.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    dispatch(loginStart());

    try {
      const res = await authService.signup({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim(),
        password,
        plan,
      });

      dispatch(loginSuccess(res.user));
      dispatch(setTenant(res.tenant));
      dispatch(addAuditLog({ tenantId: res.tenant.id, userId: res.user.id, action: 'SIGNUP', module: 'auth' }));
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Something went wrong. Please try again.'));
    }
  };

  return (
    <AuthLayout>
      <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} color="white" mb={0.5}>
            Create your account
          </Typography>
          <Typography color="rgba(255,255,255,0.4)" fontSize={13} mb={3}>
            Start your free trial — no credit card required
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 13 }} onClose={() => dispatch(clearAuthError())}>
              {authError}
            </Alert>
          )}

          {/* Full Name */}
          <TextField
            fullWidth label="Full Name" value={fullName}
            onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: '' })); }}
            error={!!fieldErrors.fullName} helperText={fieldErrors.fullName}
            sx={{ ...inputSx, mb: 2 }} autoFocus autoComplete="name"
          />

          {/* Work Email */}
          <TextField
            fullWidth label="Work Email" type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })); }}
            error={!!fieldErrors.email} helperText={fieldErrors.email}
            sx={{ ...inputSx, mb: 2 }} autoComplete="email"
          />

          {/* Company Name */}
          <TextField
            fullWidth label="Company Name" value={company}
            onChange={(e) => { setCompany(e.target.value); setFieldErrors((p) => ({ ...p, company: '' })); }}
            error={!!fieldErrors.company} helperText={fieldErrors.company}
            sx={{ ...inputSx, mb: 2 }} autoComplete="organization"
          />

          {/* Password */}
          <PasswordField
            fullWidth label="Password" value={password}
            onChange={(e) => { setPassword((e.target as HTMLInputElement).value); setFieldErrors((p) => ({ ...p, password: '' })); }}
            error={!!fieldErrors.password} helperText={fieldErrors.password}
            sx={{ mb: 1 }} autoComplete="new-password"
          />

          {/* Password strength bar */}
          {password && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={pwStrength}
                sx={{
                  height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)',
                  '.MuiLinearProgress-bar': { bgcolor: strengthColor, borderRadius: 2 },
                }}
              />
              <Typography fontSize={11} color={strengthColor} mt={0.5}>{strengthText}</Typography>
            </Box>
          )}

          {/* Confirm Password */}
          <PasswordField
            fullWidth label="Confirm Password" value={confirmPassword}
            onChange={(e) => { setConfirmPassword((e.target as HTMLInputElement).value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })); }}
            error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword}
            sx={{ mb: 3 }} autoComplete="new-password"
          />

          {/* Plan Selection */}
          <Typography fontSize={13} fontWeight={600} color="rgba(255,255,255,0.7)" mb={1}>
            Choose a plan
          </Typography>
          <ToggleButtonGroup
            exclusive value={plan} onChange={(_, v) => { if (v) setPlan(v as Plan); }}
            fullWidth sx={{ mb: 1.5 }}
          >
            {(['basic', 'pro', 'enterprise'] as Plan[]).map((p) => (
              <ToggleButton
                key={p} value={p}
                sx={{
                  color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.12)',
                  fontWeight: 600, fontSize: 13, textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(37,99,235,0.2)', color: '#60A5FA',
                    borderColor: '#2563EB',
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                {PLAN_LABELS[p]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography fontSize={12} color="rgba(255,255,255,0.35)" mb={1.5}>
            {PLAN_SUBTITLES[plan]}
          </Typography>

          {/* Feature list for selected plan */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.5, mb: 3 }}>
            {PLAN_FEATURES.map((f) => {
              const included = f.plans.includes(plan);
              return (
                <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Check size={13} color={included ? '#10B981' : 'rgba(255,255,255,0.15)'} />
                  <Typography fontSize={12} color={included ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'}>
                    {f.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Terms */}
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setFieldErrors((p) => ({ ...p, agreed: '' })); }}
                size="small"
                sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={
              <Typography fontSize={13} color="rgba(255,255,255,0.5)">
                I agree to the{' '}
                <Typography component="span" fontSize={13} color="#60A5FA">Terms of Service</Typography>
                {' '}and{' '}
                <Typography component="span" fontSize={13} color="#60A5FA">Privacy Policy</Typography>
              </Typography>
            }
            sx={{ mb: fieldErrors.agreed ? 0 : 2 }}
          />
          {fieldErrors.agreed && (
            <Typography fontSize={12} color="#F87171" mb={2}>{fieldErrors.agreed}</Typography>
          )}

          <Button
            fullWidth variant="contained" size="large"
            onClick={handleSignUp} disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UserPlus size={18} />}
            sx={{
              py: 1.5, fontWeight: 700, fontSize: 15, borderRadius: 2,
              bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' },
              '&.Mui-disabled': { bgcolor: 'rgba(37,99,235,0.5)', color: 'rgba(255,255,255,0.5)' },
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography fontSize={13} color="rgba(255,255,255,0.4)" textAlign="center">
            Already have an account?{' '}
            <RouterLink to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
              <Typography component="span" fontSize={13} color="#60A5FA" sx={{ '&:hover': { color: '#93C5FD' } }}>
                Sign in
              </Typography>
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default SignUpPage;
