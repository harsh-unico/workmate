import { apiClient } from '../utils/apiClient'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * List members of a project (protected)
 * Backend: GET /project-members?projectId=...
 */
export const listProjectMembers = async ({ projectId } = {}) => {
  const params = new URLSearchParams()
  if (projectId !== undefined && projectId !== null && String(projectId) !== '') {
    params.set('projectId', String(projectId))
  }
  const qs = params.toString()
  return apiClient.get(`${API_ENDPOINTS.PROJECT_MEMBER.LIST}${qs ? `?${qs}` : ''}`)
}


