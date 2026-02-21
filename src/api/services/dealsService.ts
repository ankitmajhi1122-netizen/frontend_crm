/**
 * dealsService
 * ------------
 * Backend contract:
 *   GET    /deals?tenantId=xxx          → Deal[]
 *   GET    /deals/:id                   → Deal
 *   POST   /deals                       → Deal
 *   PUT    /deals/:id                   → Deal
 *   DELETE /deals/:id                   → 204
 *
 * Query params supported:
 *   tenantId, stage, status, search, page, limit
 */

import { apiClient } from '../apiClient';
import { Deal } from '../../shared/types';

export const dealsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Deal[]>(`/deals?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Deal>(`/deals/${id}`),

  create: (payload: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Deal>('/deals', payload),

  update: (id: string, payload: Partial<Deal>) =>
    apiClient.put<Deal>(`/deals/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/deals/${id}`),
};
