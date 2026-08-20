/**
 * Base API Client configured for Node.js / Express backend with PostgreSQL & Prisma.
 * Handles baseURL, JWT token attachment, request formatting, and fallback mock handling.
 */

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

export const getAuthToken = () => {
  try {
    return sessionStorage.getItem('devcraft_auth_token') || null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem('devcraft_auth_token', token);
    } else {
      sessionStorage.removeItem('devcraft_auth_token');
    }
  } catch (err) {
    console.error('Failed to store auth token in sessionStorage', err);
  }
};

/**
 * Standard fetch wrapper for REST API calls
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized -> session expiration
    if (response.status === 401) {
      setAuthToken(null);
      // Optional: window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is not reached, propagate error for services to handle or provide fallback
    throw error;
  }
}
