/**
 * Centralized API URL builder
 * Works in both development and production
 */

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Remove trailing slash from baseUrl if present
  const cleanBase = baseUrl.replace(/\/$/, '');
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBase}${cleanEndpoint}`;
};

/**
 * Fetch with auth token from localStorage
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });
};
