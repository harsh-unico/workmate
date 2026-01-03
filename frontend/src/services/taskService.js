import { apiClient } from '../utils/apiClient'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Create a task (protected)
 * Backend accepts: title, description, status, priority, dueDate, projectId, assigneeId/assigneeEmail
 */
export const createTask = async (payload) => {
  return apiClient.post(API_ENDPOINTS.TASK.CREATE, payload)
}

export const listTasks = async (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    params.set(k, String(v))
  })
  const qs = params.toString()
  return apiClient.get(`${API_ENDPOINTS.TASK.LIST}${qs ? `?${qs}` : ''}`)
}

export const getTaskById = async (taskId) => {
  if (!taskId) throw new Error('taskId is required')
  return apiClient.get(`${API_ENDPOINTS.TASK.LIST}/${encodeURIComponent(String(taskId))}`)
}

export const updateTaskById = async (taskId, payload = {}) => {
  if (!taskId) throw new Error('taskId is required')
  return apiClient.patch(
    `${API_ENDPOINTS.TASK.LIST}/${encodeURIComponent(String(taskId))}`,
    payload
  )
}

export const deleteTaskById = async (taskId) => {
  if (!taskId) throw new Error('taskId is required')
  return apiClient.delete(`${API_ENDPOINTS.TASK.LIST}/${encodeURIComponent(String(taskId))}`)
}


