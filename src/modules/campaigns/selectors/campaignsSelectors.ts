import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllCampaigns = (state: RootState) => state.campaigns.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.campaigns.searchQuery;

export const selectTenantCampaigns = createSelector(
  [selectAllCampaigns, selectTenantId, selectUserId, selectUserRole],
  (items, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(items, tenantId), userId, role)
);

export const selectFilteredCampaigns = createSelector(
  [selectTenantCampaigns, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
  }
);
