import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllQuotes = (state: RootState) => state.quotes.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.quotes.searchQuery;

export const selectTenantQuotes = createSelector(
  [selectAllQuotes, selectTenantId, selectUserId, selectUserRole],
  (items, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(items, tenantId), userId, role)
);

export const selectFilteredQuotes = createSelector(
  [selectTenantQuotes, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((q2) => q2.number.toLowerCase().includes(q) || q2.contactName.toLowerCase().includes(q));
  }
);
