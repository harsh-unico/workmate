import { apiClient } from '../utils/apiClient'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Fetch organisations for the logged-in user (protected)
 */
export const getOrganisations = async () => {
  return apiClient.get(API_ENDPOINTS.ORG.LIST_ADMIN)
}

/**
 * Create a new organisation (protected)
 * @param {object} payload - Organisation data from the form
 */
export const createOrganisation = async (payload) => {
  return apiClient.post(API_ENDPOINTS.ORG.CREATE, payload)
}

/**
 * Org counts (protected)
 */
export const getOrgProjectsCount = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/projects/count`
  )
}

export const getOrgMembersCount = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/members/count`
  )
}

export const getOrgTasksCount = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/tasks/count`
  )
}

export const getOrganisationById = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(`${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}`)
}

export const getOrganisationProjects = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/projects`
  )
}

export const getOrganisationMembers = async (orgId) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.get(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/members`
  )
}

export const inviteOrganisationMembers = async (orgId, emails) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.post(
    `${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}/members/invite`,
    { emails }
  )
}

export const updateOrganisation = async (orgId, payload) => {
  if (!orgId) throw new Error('orgId is required')
  return apiClient.patch(`${API_ENDPOINTS.ORG.LIST}/${encodeURIComponent(String(orgId))}`, payload)
}



