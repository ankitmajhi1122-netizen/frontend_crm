/**
 * tenantsService
 * --------------
 * Backend contract:
 *   GET    /tenants/:id                 → Tenant
 *   POST   /tenants                     → Tenant  (signup creates new org)
 *   PATCH  /tenants/:id                 → Tenant  (update name/logo/color)
 *
 *   GET    /tenants/:id/subscription    → Subscription
 *   POST   /tenants/:id/subscription    → Subscription (upgrade/downgrade plan)
 */

import { apiClient } from '../apiClient';
import { Tenant, Subscription } from '../../shared/types';

export const tenantsService = {
  getById: (id: string) =>
    apiClient.get<Tenant>(`/tenants/${id}`),

  create: (payload: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Tenant>('/tenants', payload),

  update: (id: string, payload: Partial<Tenant>) =>
    apiClient.patch<Tenant>(`/tenants/${id}`, payload),

  getSubscription: (tenantId: string) =>
    apiClient.get<Subscription>(`/tenants/${tenantId}/subscription`),

  updateSubscription: (tenantId: string, plan: string) =>
    apiClient.post<Subscription>(`/tenants/${tenantId}/subscription`, { plan }),
};
