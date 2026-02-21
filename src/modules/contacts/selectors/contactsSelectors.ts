import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

const selectAllContacts = (state: RootState) => state.contacts.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';
const selectSearchQuery = (state: RootState) => state.contacts.searchQuery;

export const selectTenantContacts = createSelector(
  [selectAllContacts, selectTenantId, selectUserId, selectUserRole],
  (contacts, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(contacts, tenantId), userId, role)
);

export const selectFilteredContacts = createSelector(
  [selectTenantContacts, selectSearchQuery],
  (contacts, query) => {
    if (!query.trim()) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(
      (c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }
);
