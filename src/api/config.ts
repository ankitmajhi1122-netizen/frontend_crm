/**
 * API Configuration
 * -----------------
 * Set VITE_API_BASE_URL in your .env.local to point to your backend.
 *
 * .env.local example:
 *   VITE_API_BASE_URL=http://localhost:8000/api/v1
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export const API_TIMEOUT_MS = 10_000;

/**
 * Auth token storage key — used by apiClient when real backend is enabled.
 * The backend should return a JWT on login which is stored here.
 */
export const AUTH_TOKEN_KEY = 'crm_access_token';
