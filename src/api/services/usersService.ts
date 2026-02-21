/**
 * usersService
 * ------------
 * Backend contract:
 *   GET    /users?tenantId=xxx          → User[]
 *   GET    /users/:id                   → User
 *   POST   /users                       → User  (admin creates employee)
 *   PATCH  /users/:id                   → User  (update name/role/status)
 *   DELETE /users/:id                   → 204
 *
 *   POST   /users/:id/reset-password    → User  (admin sets temp password)
 *     body: { newPassword: string }
 *
 *   POST   /users/:id/change-password   → User  (user changes own password)
 *     body: { currentPassword: string; newPassword: string }
 */

import { apiClient } from '../apiClient';
import { User, UserRole, UserStatus } from '../../shared/types';

export interface CreateUserPayload {
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;          // temp password set by admin
  mustResetPassword: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const usersService = {
  getAll: (tenantId: string) =>
    apiClient.get<User[]>(`/users?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    apiClient.post<User>('/users', payload),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<User>(`/users/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/users/${id}`),

  adminResetPassword: (id: string, newPassword: string) =>
    apiClient.post<User>(`/users/${id}/reset-password`, { newPassword }),

  changePassword: (id: string, payload: ChangePasswordPayload) =>
    apiClient.post<User>(`/users/${id}/change-password`, payload),
};
