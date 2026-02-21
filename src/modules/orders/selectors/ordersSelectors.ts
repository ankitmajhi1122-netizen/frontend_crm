import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllOrders = (state: RootState) => state.orders.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.orders.searchQuery;

export const selectTenantOrders = createSelector(
  [selectAllOrders, selectTenantId, selectUserId, selectUserRole],
  (items, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(items, tenantId), userId, role)
);

export const selectFilteredOrders = createSelector(
  [selectTenantOrders, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((o) => o.number.toLowerCase().includes(q) || o.client.toLowerCase().includes(q));
  }
);
