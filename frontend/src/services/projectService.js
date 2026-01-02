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

export const getProjectById = async (projectId) => {
  if (!projectId) throw new Error('projectId is required')
  return apiClient.get(`${API_ENDPOINTS.PROJECT.LIST}/${encodeURIComponent(String(projectId))}`)
}



