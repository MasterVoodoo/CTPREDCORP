export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    BUILDINGS: '/api/buildings',
    UNITS: '/api/units',
    APPOINTMENTS: '/api/admin/appointments',
    EMAIL: '/api/email',
    ADMIN: '/api/admin',
    FINANCIAL: '/api/financial',
    UPLOADS: '/api/uploads',
    HEALTH: '/api/health',
  },
  TIMEOUT: 30000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
