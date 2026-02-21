import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllInvoices = (state: RootState) => state.invoices.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.invoices.searchQuery;

export const selectTenantInvoices = createSelector(
  [selectAllInvoices, selectTenantId, selectUserId, selectUserRole],
  (items, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(items, tenantId), userId, role)
);

export const selectFilteredInvoices = createSelector(
  [selectTenantInvoices, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.number.toLowerCase().includes(q) || i.client.toLowerCase().includes(q));
  }
);
