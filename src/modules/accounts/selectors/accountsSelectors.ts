import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllAccounts = (state: RootState) => state.accounts.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.accounts.searchQuery;

export const selectTenantAccounts = createSelector(
  [selectAllAccounts, selectTenantId, selectUserId, selectUserRole],
  (accounts, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(accounts, tenantId), userId, role)
);

export const selectFilteredAccounts = createSelector(
  [selectTenantAccounts, selectSearchQuery],
  (accounts, query) => {
    if (!query.trim()) return accounts;
    const q = query.toLowerCase();
    return accounts.filter((a) => a.name.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q));
  }
);
