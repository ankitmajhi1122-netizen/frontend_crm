import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllDeals = (state: RootState) => state.deals.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.deals.searchQuery;

export const selectTenantDeals = createSelector(
  [selectAllDeals, selectTenantId, selectUserId, selectUserRole],
  (deals, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(deals, tenantId), userId, role)
);

export const selectFilteredDeals = createSelector(
  [selectTenantDeals, selectSearchQuery],
  (deals, query) => {
    if (!query.trim()) return deals;
    const q = query.toLowerCase();
    return deals.filter((d) => d.title.toLowerCase().includes(q));
  }
);

export const selectDealsCount = createSelector([selectTenantDeals], (d) => d.length);
export const selectWonDealsCount = createSelector([selectTenantDeals], (d) => d.filter((x) => x.status === 'won').length);
