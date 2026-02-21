/**
 * contactsService
 * ---------------
 * Backend contract:
 *   GET    /contacts?tenantId=xxx       → Contact[]
 *   GET    /contacts/:id                → Contact
 *   POST   /contacts                    → Contact
 *   PUT    /contacts/:id                → Contact
 *   DELETE /contacts/:id                → 204
 */

import { apiClient } from '../apiClient';
import { Contact } from '../../shared/types';

export const contactsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Contact[]>(`/contacts?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Contact>(`/contacts/${id}`),

  create: (payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Contact>('/contacts', payload),

  update: (id: string, payload: Partial<Contact>) =>
    apiClient.put<Contact>(`/contacts/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/contacts/${id}`),
};
