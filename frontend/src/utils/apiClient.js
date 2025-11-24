import { API_CONFIG, STORAGE_KEYS } from './constants'

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
   * Get authorization token from storage
   */
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  /**
   * Set authorization token in storage
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    }
  }

  /**
   * Get default headers
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText || 'An error occurred',
      }))
      throw new Error(error.message || 'An error occurred')
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
      ...options,
    })

    return this.handleResponse(response)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient

