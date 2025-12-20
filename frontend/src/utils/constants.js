/**
 * API Configuration
 * Update these values based on your backend API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
}

/**
 * API Endpoints
 * Define all API endpoints here
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
}

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
}

/**
 * Route Paths
 */
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  OTP_VERIFICATION: '/otp',
  DASHBOARD: '/dashboard',
  ORGANISATIONS: '/organisations',
  CREATE_ORGANISATION: '/organisations/create',
  ORGANISATION_DETAIL: '/organisations/:id/:section',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  EMPLOYEE_DASHBOARD: '/employee-dashboard',
}

