import axios from 'axios';

/**
 * API base URL strategy:
 * - Dev: unset VITE_API_URL → requests go to the Vite dev server, which proxies to Laravel.
 *   Same-origin cookies are required for Sanctum CSRF/session auth.
 * - Production: set VITE_API_URL to your Laravel backend (e.g. http://localhost:8000).
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const sharedConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
};

const api = axios.create({
  ...sharedConfig,
  baseURL: `${API_BASE_URL}/api`,
});

// Fortify auth routes live outside /api
export const webApi = axios.create(sharedConfig);

export default api;
