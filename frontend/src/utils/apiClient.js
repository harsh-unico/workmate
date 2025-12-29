import { API_CONFIG, ROUTES, STORAGE_KEYS } from './constants'

/**
 * API Client for making HTTP requests
 * This will be used by all service functions
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  /**
   * Get default headers
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    return headers
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      // If the user is not authenticated or session expired, clear local auth and redirect
      if (response.status === 401) {
        const isAuthEndpoint = typeof response.url === 'string' && response.url.includes('/auth/')
        const AUTH_ROUTES = [
          ROUTES.LOGIN,
          ROUTES.REGISTER,
          ROUTES.FORGOT_PASSWORD,
          ROUTES.RESET_PASSWORD,
          ROUTES.OTP_VERIFICATION,
        ]
        const isOnAuthRoute = AUTH_ROUTES.includes(window.location.pathname)

        try {
          localStorage.removeItem(STORAGE_KEYS.USER)
        } catch {
          // ignore storage errors
        }

        // Only redirect to login if we are not already on an auth page
        // and the failing call was not itself an auth endpoint.
        if (!isAuthEndpoint && !isOnAuthRoute && window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN
        }
      }

      const errorBody = await response.json().catch(() => ({
        message: response.statusText || 'An error occurred',
      }))
      const message =
        errorBody?.message ||
        errorBody?.error ||
        response.statusText ||
        'An error occurred'
      throw new Error(message)
    }

    return response.json()
  }

  /**
   * Make GET request
   */
  async get(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      credentials: 'include',
      ...options,
    })

    return this.handleResponse(response)
  }

  /**
   * Make POST request
   */
  async post(endpoint, data, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
      credentials: 'include',
      ...options,
    })

    return this.handleResponse(response)
  }

  /**
   * Make PUT request
   */
  async put(endpoint, data, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
      credentials: 'include',
      ...options,
    })

    return this.handleResponse(response)
  }

  /**
   * Make PATCH request
   */
  async patch(endpoint, data, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
      credentials: 'include',
      ...options,
    })

    return this.handleResponse(response)
  }

  /**
   * Make DELETE request
   */
  async delete(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(options.headers),
      credentials: 'include',
      ...options,
    })

    return this.handleResponse(response)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient

