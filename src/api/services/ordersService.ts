/**
 * ordersService
 * -------------
 * Backend contract:
 *   GET    /orders?tenantId=xxx         → Order[]
 *   GET    /orders/:id                  → Order
 *   POST   /orders                      → Order
 *   PUT    /orders/:id                  → Order
 *   DELETE /orders/:id                  → 204
 *
 * Query params supported:
 *   tenantId, status, contactId, page, limit
 */

import { apiClient } from '../apiClient';
import { Order } from '../../shared/types';

export const ordersService = {
  getAll: (tenantId: string) =>
    apiClient.get<Order[]>(`/orders?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),

  create: (payload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Order>('/orders', payload),

  update: (id: string, payload: Partial<Order>) =>
    apiClient.put<Order>(`/orders/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/orders/${id}`),
};
