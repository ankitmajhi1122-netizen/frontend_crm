import React, { useState, useCallback } from 'react';
import {
  Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Select, MenuItem, FormControl, SelectChangeEvent, Chip, Box,
  Alert, Button, Tooltip, IconButton, Avatar, Stack, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider,
} from '@mui/material';
import {
  UserPlus, Search, UserX, UserCheck, KeyRound, RefreshCw, Copy, CheckCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addAuditLog } from '../../../store/slices/auditSlice';
import {
  setUserStatus, updateUser, adminResetPassword, ManagedUser,
} from '../../../store/slices/usersSlice';
import { selectCurrentTenant, selectCurrentSubscription } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { UserRole } from '../../../shared/types';
import AddEmployeeModal from './AddEmployeeModal';
import { usersService } from '../../../api/services/usersService';

const ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'SALES'];
const ROLE_COLORS: Record<UserRole, 'error' | 'warning' | 'default'> = {
  ADMIN: 'error', MANAGER: 'warning', SALES: 'default',
};

function generateTempPassword(): string {
  const adjectives = ['Blue', 'Fast', 'Bold', 'Cool', 'Wise', 'Keen', 'Sharp', 'Bright'];
  const nouns = ['Tiger', 'Eagle', 'Storm', 'River', 'Comet', 'Spark', 'Cloud', 'Rock'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}${noun}${num}!`;
}

function userInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function avatarColor(name: string) {
  const colors = ['#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669', '#0891B2'];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface ResetConfirmState {
  userId: string;
  userName: string;
  newPassword: string;
  copied: boolean;
}

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector(selectCurrentTenant);
  const currentUser = useAppSelector(selectCurrentUser);
  const subscription = useAppSelector(selectCurrentSubscription);
  const allUsers = useAppSelector((s) => s.users.items);

  const tenantUsers = allUsers.filter((u) => u.tenantId === tenant?.id);
  const maxUsers = subscription?.maxUsers ?? 5;
  const atLimit = tenantUsers.length >= maxUsers;

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState<ResetConfirmState | null>(null);

  const filtered = tenantUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRoleChange = useCallback(
    (user: ManagedUser) => async (e: SelectChangeEvent) => {
      const newRole = e.target.value as UserRole;
      if (!tenant || !currentUser) return;

      try {
        await usersService.update(user.id, { role: newRole });
        dispatch(updateUser({ id: user.id, role: newRole }));
        dispatch(addAuditLog({
          tenantId: tenant.id,
          userId: currentUser.id,
          action: 'ROLE_CHANGE',
          module: 'settings',
          recordId: user.id,
          meta: { from: user.role, to: newRole },
        }));
      } catch (err) {
        console.error('Failed to change role', err);
      }
    },
    [dispatch, tenant, currentUser],
  );

  const handleToggleStatus = useCallback(
    async (user: ManagedUser) => {
      if (!tenant || !currentUser) return;
      const newStatus = user.status === 'active' ? 'inactive' : 'active';

      try {
        await usersService.update(user.id, { status: newStatus });
        dispatch(setUserStatus({ id: user.id, status: newStatus }));
        dispatch(addAuditLog({
          tenantId: tenant.id,
          userId: currentUser.id,
          action: newStatus === 'inactive' ? 'USER_DEACTIVATED' : 'USER_REACTIVATED',
          module: 'settings',
          recordId: user.id,
          meta: { name: user.name },
        }));
      } catch (err) {
        console.error('Failed to toggle user status', err);
      }
    },
    [dispatch, tenant, currentUser],
  );

  const handleAdminReset = useCallback(
    (user: ManagedUser) => {
      const newPassword = generateTempPassword();
      setResetConfirm({ userId: user.id, userName: user.name, newPassword, copied: false });
    },
    [],
  );

  const confirmReset = async () => {
    if (!resetConfirm || !tenant || !currentUser) return;

    try {
      await usersService.adminResetPassword(resetConfirm.userId, resetConfirm.newPassword);
      dispatch(adminResetPassword({ id: resetConfirm.userId, newPassword: resetConfirm.newPassword }));
      dispatch(addAuditLog({
        tenantId: tenant.id,
        userId: currentUser.id,
        action: 'ADMIN_PASSWORD_RESET',
        module: 'settings',
        recordId: resetConfirm.userId,
        meta: { userName: resetConfirm.userName },
      }));
    } catch (err) {
      console.error('Failed to reset password', err);
    }
  };

  const existingEmails = tenantUsers.map((u) => u.email.toLowerCase());

  return (
    <>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>Team Members</Typography>
              <Typography variant="caption" color="text.secondary">
                Manage employees, roles and access
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${tenantUsers.length} / ${maxUsers} users`}
                color={atLimit ? 'error' : 'default'}
                size="small"
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<UserPlus size={15} />}
                onClick={() => setAddOpen(true)}
                disabled={atLimit}
                sx={{ fontWeight: 700 }}
              >
                Add Employee
              </Button>
            </Stack>
          </Box>

          {atLimit && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              User limit reached ({maxUsers} users). Upgrade your plan to add more team members.
            </Alert>
          )}

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Search size={16} /></InputAdornment>
              ),
            }}
          />

          {/* Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => {
                  const isMe = u.id === currentUser?.id;
                  const effectiveRole = u.role;
                  return (
                    <TableRow key={u.id} hover sx={{ opacity: u.status === 'inactive' ? 0.55 : 1 }}>
                      {/* Employee cell */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 32, height: 32, fontSize: 12, fontWeight: 700,
                              bgcolor: avatarColor(u.name),
                            }}
                          >
                            {userInitials(u.name)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography fontSize={13} fontWeight={600}>{u.name}</Typography>
                              {isMe && <Chip label="You" size="small" sx={{ height: 16, fontSize: 10 }} />}
                              {u.mustResetPassword && (
                                <Chip
                                  label="Temp password"
                                  size="small"
                                  color="warning"
                                  sx={{ height: 16, fontSize: 10 }}
                                />
                              )}
                            </Box>
                            <Typography fontSize={11} color="text.secondary">{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Role cell */}
                      <TableCell>
                        {isMe ? (
                          <Chip label={effectiveRole} size="small" color={ROLE_COLORS[effectiveRole]} />
                        ) : (
                          <FormControl size="small" variant="outlined">
                            <Select
                              value={effectiveRole}
                              onChange={handleRoleChange(u)}
                              sx={{ fontSize: 13 }}
                              disabled={u.status === 'inactive'}
                            >
                              {ROLES.map((r) => (
                                <MenuItem key={r} value={r}>
                                  <Chip label={r} size="small" color={ROLE_COLORS[r]} sx={{ pointerEvents: 'none' }} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>

                      {/* Status cell */}
                      <TableCell>
                        <Chip
                          label={u.status === 'active' ? 'Active' : 'Inactive'}
                          size="small"
                          color={u.status === 'active' ? 'success' : 'default'}
                        />
                      </TableCell>

                      {/* Actions cell */}
                      <TableCell align="right">
                        {!isMe && (
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Reset password (generates new temp password)">
                              <IconButton
                                size="small"
                                onClick={() => handleAdminReset(u)}
                                disabled={u.status === 'inactive'}
                              >
                                <KeyRound size={15} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={u.status === 'active' ? 'Deactivate user' : 'Reactivate user'}>
                              <IconButton
                                size="small"
                                color={u.status === 'active' ? 'error' : 'success'}
                                onClick={() => handleToggleStatus(u)}
                              >
                                {u.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingEmails={existingEmails}
        currentUserCount={tenantUsers.length}
      />

      {/* Admin Reset Password Confirmation Dialog */}
      <Dialog
        open={!!resetConfirm}
        onClose={() => setResetConfirm(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyRound size={20} />
            <Typography fontWeight={700}>Reset Password</Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Typography fontSize={14} color="text.secondary" mb={2}>
            A new temporary password will be generated for{' '}
            <strong>{resetConfirm?.userName}</strong>. They'll be asked to change
            it on their next login.
          </Typography>
          {resetConfirm && (
            <Box sx={{
              bgcolor: 'action.hover', borderRadius: 2, p: 2,
              display: 'flex', alignItems: 'center', gap: 1,
            }}>
              <RefreshCw size={14} />
              <Typography fontFamily="monospace" fontSize={15} fontWeight={700} flex={1}>
                {resetConfirm.newPassword}
              </Typography>
              <Tooltip title={resetConfirm.copied ? 'Copied!' : 'Copy'}>
                <IconButton
                  size="small"
                  color={resetConfirm.copied ? 'success' : 'default'}
                  onClick={() => {
                    navigator.clipboard.writeText(resetConfirm.newPassword).catch(() => { });
                    setResetConfirm((p) => p ? { ...p, copied: true } : p);
                  }}
                >
                  {resetConfirm.copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2, fontSize: 13 }}>
            Share this password with the employee directly. The old password will stop working immediately.
          </Alert>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button color="inherit" onClick={() => setResetConfirm(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<KeyRound size={15} />}
            onClick={() => {
              confirmReset();
              setResetConfirm(null);
            }}
            sx={{ fontWeight: 700 }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagement;
