/**
 * quotesService
 * -------------
 * Backend contract:
 *   GET    /quotes?tenantId=xxx         → Quote[]
 *   GET    /quotes/:id                  → Quote
 *   POST   /quotes                      → Quote
 *   PUT    /quotes/:id                  → Quote
 *   DELETE /quotes/:id                  → 204
 */

import { apiClient } from '../apiClient';
import { Quote } from '../../shared/types';

export const quotesService = {
  getAll: (tenantId: string) =>
    apiClient.get<Quote[]>(`/quotes?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Quote>(`/quotes/${id}`),

  create: (payload: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Quote>('/quotes', payload),

  update: (id: string, payload: Partial<Quote>) =>
    apiClient.put<Quote>(`/quotes/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/quotes/${id}`),
};
