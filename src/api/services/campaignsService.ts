/**
 * campaignsService
 * ----------------
 * Backend contract:
 *   GET    /campaigns?tenantId=xxx      → Campaign[]
 *   GET    /campaigns/:id               → Campaign
 *   POST   /campaigns                   → Campaign
 *   PUT    /campaigns/:id               → Campaign
 *   DELETE /campaigns/:id               → 204
 */

import { apiClient } from '../apiClient';
import { Campaign } from '../../shared/types';

export const campaignsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Campaign[]>(`/campaigns?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Campaign>(`/campaigns/${id}`),

  create: (payload: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Campaign>('/campaigns', payload),

  update: (id: string, payload: Partial<Campaign>) =>
    apiClient.put<Campaign>(`/campaigns/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/campaigns/${id}`),
};
