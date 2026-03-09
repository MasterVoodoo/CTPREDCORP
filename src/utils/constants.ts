export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  PROPERTIES: '/properties',
  BUILDING: (id: string) => `/properties/${id}`,
  UNIT: (id: string) => `/units/${id}`,
  SPACES: '/spaces',
  SCHEDULE: '/schedule',
  SEARCH: '/search',
  TENANT_PORTAL: '/tenant-portal',
  
  SUSTAINABILITY: {
    BOARD: '/sustainability/board-of-directors',
    MANAGEMENT: '/sustainability/management-team',
    POLICIES: '/sustainability/policies',
    COMPLIANCE: '/sustainability/compliance',
    INVESTOR: '/sustainability/investor-relations',
  },
  
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
  },
} as const;

export const API_ENDPOINTS = {
  BUILDINGS: '/api/buildings',
  UNITS: '/api/units',
  APPOINTMENTS: '/api/admin/appointments',
  EMAIL: '/api/email',
  ADMIN: '/api/admin',
  FINANCIAL: '/api/financial',
  UPLOADS: '/api/uploads',
  HEALTH: '/api/health',
} as const;
