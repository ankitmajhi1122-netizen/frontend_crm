import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant } from '../../../shared/utils/filterUtils';

const selectAllProducts = (state: RootState) => state.products.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectSearchQuery = (state: RootState) => state.products.searchQuery;

export const selectTenantProducts = createSelector(
  [selectAllProducts, selectTenantId],
  (items, tenantId) => filterByTenant(items, tenantId)
);

export const selectFilteredProducts = createSelector(
  [selectTenantProducts, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
);
