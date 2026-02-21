import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { setTenant } from './tenantSlice';
import { selectCurrentTenant } from './tenantSelectors';
import { selectCurrentUser } from '../auth/authSelectors';
import { addAuditLog } from '../store/slices/auditSlice';
import { Tenant } from '../shared/types';

const tenants: Tenant[] = [];

const OrganizationSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTenant = useAppSelector(selectCurrentTenant);
  const currentUser = useAppSelector(selectCurrentUser);

  const handleChange = (e: SelectChangeEvent) => {
    const tenant = tenants.find((t) => t.id === e.target.value);
    if (!tenant || !currentUser) return;
    // setTenant triggers rootReducer to reset all search/filter/pagination
    dispatch(setTenant(tenant));
    dispatch(addAuditLog({
      tenantId: tenant.id,
      userId: currentUser.id,
      action: 'TENANT_SWITCH',
      module: 'tenant',
      meta: { from: currentTenant?.id, to: tenant.id },
    }));
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="caption" sx={{ color: 'grey.500', textTransform: 'uppercase', letterSpacing: 1 }}>
        Organization
      </Typography>
      <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
        <Select value={currentTenant?.id ?? ''} onChange={handleChange} sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '.MuiSvgIcon-root': { color: 'white' } }}>
          {tenants.map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrganizationSwitcher;
