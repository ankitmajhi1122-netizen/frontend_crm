/**
 * apiClient (axios)
 * ------------------
 * Axios-based HTTP client used by all API service files.
 * - Auto-attaches Authorization: Bearer <JWT> from localStorage
 * - JSON request/response
 * - Throws ApiError on non-2xx responses
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from './config';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && config.headers) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalise errors and handle 401s
axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string; detail?: string }>) => {
    const status = err.response?.status ?? 0;

    // Handle session expiration / unauthorized
    if (status === 401) {
      console.warn('[apiClient] 401 Unauthorized - clearing session');
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('crm_auth');
      localStorage.removeItem('crm_tenant');
      // If we are in the browser, redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message =
      err.response?.data?.detail ??
      err.response?.data?.message ??
      err.message ??
      'Network error';
    return Promise.reject(new ApiError(status, message));
  }
);

export const apiClient = {
  get: <T>(path: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(path, config).then((r) => r.data),

  post: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(path, body, config).then((r) => r.data),

  put: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(path, body, config).then((r) => r.data),

  patch: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(path, body, config).then((r) => r.data),

  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(path, config).then((r) => r.data),
};
