/**
 * accountsService
 * ---------------
 * Backend contract:
 *   GET    /accounts?tenantId=xxx       → Account[]
 *   GET    /accounts/:id                → Account
 *   POST   /accounts                    → Account
 *   PUT    /accounts/:id                → Account
 *   DELETE /accounts/:id                → 204
 */

import { apiClient } from '../apiClient';
import { Account } from '../../shared/types';

export const accountsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Account[]>(`/accounts?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Account>(`/accounts/${id}`),

  create: (payload: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Account>('/accounts', payload),

  update: (id: string, payload: Partial<Account>) =>
    apiClient.put<Account>(`/accounts/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/accounts/${id}`),
};
