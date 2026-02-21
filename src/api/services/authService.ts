/**
 * authService
 * -----------
 * Mock mode:  authenticates against Redux in-memory users store (handled in LoginPage).
 * Real mode:  calls POST /auth/login, POST /auth/logout, POST /auth/reset-password, etc.
 *
 * Backend contract:
 *   POST /auth/login
 *     body:    { email: string; password: string }
 *     returns: { user: User; tenant: Tenant; accessToken: string }
 *
 *   POST /auth/logout
 *     returns: 204
 *
 *   POST /auth/forgot-password
 *     body:    { email: string }
 *     returns: 204
 *
 *   POST /auth/reset-password
 *     body:    { userId: string; currentPassword: string; newPassword: string }
 *     returns: { user: User }
 *
 *   POST /auth/admin-reset-password
 *     body:    { userId: string; newPassword: string }
 *     returns: { user: User }
 */

import { apiClient } from '../apiClient';
import { AUTH_TOKEN_KEY } from '../config';
import { User, Tenant } from '../../shared/types';

export interface LoginResponse {
  user: User;
  tenant: Tenant;
  accessToken: string;
}

export interface ResetPasswordPayload {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface AdminResetPayload {
  userId: string;
  newPassword: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  company: string;
  plan: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
    return res;
  },

  async signup(payload: SignUpPayload): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/signup', payload);
    localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
    return res;
  },

  async logout(): Promise<void> {
    await apiClient.post<void>('/auth/logout', {});
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post<void>('/auth/forgot-password', { email });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<User> {
    return apiClient.post<User>('/auth/reset-password', payload);
  },

  async adminResetPassword(payload: AdminResetPayload): Promise<User> {
    return apiClient.post<User>('/auth/admin-reset-password', payload);
  },
};
