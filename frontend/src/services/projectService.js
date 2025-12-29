import { apiClient } from '../utils/apiClient'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Create a project in an organisation (protected)
 *
 * Backend expects:
 * - orgId
 * - name
 * - description
 * - startDate
 * - endDate
 */
export const createProject = async (payload) => {
  return apiClient.post(API_ENDPOINTS.PROJECT.CREATE, payload)
}


