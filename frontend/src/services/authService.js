import { apiClient } from '../utils/apiClient'
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Login user
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<object>} User data and tokens
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    
    // Store tokens if provided
    if (response.token) {
      apiClient.setAuthToken(response.token)
    }
    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
    }
    if (response.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }

    return response
  } catch (error) {
    throw new Error(error.message || 'Login failed')
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API call failed:', error)
  } finally {
    // Clear local storage
    apiClient.setAuthToken(null)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

/**
 * Register new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} User data and tokens
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    
    // Store tokens if provided
    if (response.token) {
      apiClient.setAuthToken(response.token)
    }
    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
    }
    if (response.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }

    return response
  } catch (error) {
    throw new Error(error.message || 'Registration failed')
  }
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const forgotPassword = async (email) => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  } catch (error) {
    throw new Error(error.message || 'Failed to send password reset email')
  }
}

/**
 * Reset password with token
 * @param {object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.password - New password
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetData) => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData)
  } catch (error) {
    throw new Error(error.message || 'Failed to reset password')
  }
}

/**
 * Refresh authentication token
 * @returns {Promise<object>} New tokens
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    })

    if (response.token) {
      apiClient.setAuthToken(response.token)
    }
    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
    }

    return response
  } catch (error) {
    // Clear tokens on refresh failure
    apiClient.setAuthToken(null)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    throw new Error(error.message || 'Failed to refresh token')
  }
}

