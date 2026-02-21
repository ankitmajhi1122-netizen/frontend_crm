import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllLeads = (state: RootState) => state.leads.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.leads.searchQuery;

export const selectTenantLeads = createSelector(
  [selectAllLeads, selectTenantId, selectUserId, selectUserRole],
  (leads, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(leads, tenantId), userId, role)
);

export const selectFilteredLeads = createSelector(
  [selectTenantLeads, selectSearchQuery],
  (leads, query) => {
    if (!query.trim()) return leads;
    const q = query.toLowerCase();
    return leads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
    );
  }
);

export const selectLeadsCount = createSelector([selectTenantLeads], (leads) => leads.length);
