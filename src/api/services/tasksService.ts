/**
 * tasksService
 * ------------
 * Backend contract:
 *   GET    /tasks?tenantId=xxx          → Task[]
 *   GET    /tasks/:id                   → Task
 *   POST   /tasks                       → Task
 *   PUT    /tasks/:id                   → Task
 *   DELETE /tasks/:id                   → 204
 *
 * Query params supported:
 *   tenantId, assignedTo, status, priority, relatedTo
 */

import { apiClient } from '../apiClient';
import { Task } from '../../shared/types';

export const tasksService = {
  getAll: (tenantId: string) =>
    apiClient.get<Task[]>(`/tasks?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Task>(`/tasks/${id}`),

  create: (payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Task>('/tasks', payload),

  update: (id: string, payload: Partial<Task>) =>
    apiClient.put<Task>(`/tasks/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/tasks/${id}`),
};
