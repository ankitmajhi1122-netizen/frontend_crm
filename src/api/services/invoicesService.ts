/**
 * invoicesService
 * ---------------
 * Backend contract:
 *   GET    /invoices?tenantId=xxx       → Invoice[]
 *   GET    /invoices/:id                → Invoice
 *   POST   /invoices                    → Invoice
 *   PUT    /invoices/:id                → Invoice
 *   DELETE /invoices/:id                → 204
 *
 * Query params supported:
 *   tenantId, status, clientId, page, limit
 */

import { apiClient } from '../apiClient';
import { Invoice } from '../../shared/types';

export const invoicesService = {
  getAll: (tenantId: string) =>
    apiClient.get<Invoice[]>(`/invoices?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Invoice>(`/invoices/${id}`),

  create: (payload: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Invoice>('/invoices', payload),

  update: (id: string, payload: Partial<Invoice>) =>
    apiClient.put<Invoice>(`/invoices/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/invoices/${id}`),
};
