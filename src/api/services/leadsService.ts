/**
 * leadsService
 * ------------
 * Backend contract:
 *   GET    /leads?tenantId=xxx          → Lead[]
 *   GET    /leads/:id                   → Lead
 *   POST   /leads                       → Lead
 *   PUT    /leads/:id                   → Lead
 *   DELETE /leads/:id                   → 204
 *
 * Query params supported:
 *   tenantId, status, source, search, page, limit
 */

import { apiClient } from '../apiClient';
import { Lead } from '../../shared/types';

export const leadsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Lead[]>(`/leads?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Lead>(`/leads/${id}`),

  create: (payload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Lead>('/leads', payload),

  update: (id: string, payload: Partial<Lead>) =>
    apiClient.put<Lead>(`/leads/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/leads/${id}`),
};
