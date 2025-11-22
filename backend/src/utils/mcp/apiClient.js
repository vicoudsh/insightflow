/**
 * Internal API client for MCP tools
 * Calls the REST API endpoints instead of directly accessing the database
 */

const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}/api`

/**
 * Make an internal API request
 */
async function apiRequest(method, endpoint, data = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && (method === 'POST' || method === 'PUT' || method === 'PATCH') && {
        body: JSON.stringify(data),
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || 'API request failed',
        message: responseData.message || responseData.error,
        status: response.status,
        details: responseData.details,
      }
    }

    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
      pagination: responseData.pagination,
    }
  } catch (error) {
    console.error('API Client Error:', error)
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500,
    }
  }
}

export const apiClient = {
  // Projects
  getProjects: (token, query = {}) =>
    apiRequest('GET', `/projects?${new URLSearchParams(query).toString()}`, null, token),
  getProject: (token, id) => apiRequest('GET', `/projects/${id}`, null, token),
  createProject: (token, data) => apiRequest('POST', '/projects', data, token),
  updateProject: (token, id, data) => apiRequest('PUT', `/projects/${id}`, data, token),
  deleteProject: (token, id) => apiRequest('DELETE', `/projects/${id}`, null, token),

  // Stacks
  getStacks: (token, query = {}) =>
    apiRequest('GET', `/stacks?${new URLSearchParams(query).toString()}`, null, token),
  getStack: (token, id) => apiRequest('GET', `/stacks/${id}`, null, token),
  createStack: (token, data) => apiRequest('POST', '/stacks', data, token),
  updateStack: (token, id, data) => apiRequest('PUT', `/stacks/${id}`, data, token),
  deleteStack: (token, id) => apiRequest('DELETE', `/stacks/${id}`, null, token),

  // Roadmaps
  getRoadmaps: (token, query = {}) =>
    apiRequest('GET', `/roadmaps?${new URLSearchParams(query).toString()}`, null, token),
  getRoadmap: (token, id) => apiRequest('GET', `/roadmaps/${id}`, null, token),
  createRoadmap: (token, data) => apiRequest('POST', '/roadmaps', data, token),
  updateRoadmap: (token, id, data) => apiRequest('PUT', `/roadmaps/${id}`, data, token),
  deleteRoadmap: (token, id) => apiRequest('DELETE', `/roadmaps/${id}`, null, token),

  // Tasks
  getTasks: (token, query = {}) =>
    apiRequest('GET', `/tasks?${new URLSearchParams(query).toString()}`, null, token),
  getTask: (token, id) => apiRequest('GET', `/tasks/${id}`, null, token),
  createTask: (token, data) => apiRequest('POST', '/tasks', data, token),
  updateTask: (token, id, data) => apiRequest('PUT', `/tasks/${id}`, data, token),
  deleteTask: (token, id) => apiRequest('DELETE', `/tasks/${id}`, null, token),

  // Subtasks
  getSubtasks: (token, query = {}) =>
    apiRequest('GET', `/subtasks?${new URLSearchParams(query).toString()}`, null, token),
  getSubtask: (token, id) => apiRequest('GET', `/subtasks/${id}`, null, token),
  createSubtask: (token, data) => apiRequest('POST', '/subtasks', data, token),
  updateSubtask: (token, id, data) => apiRequest('PUT', `/subtasks/${id}`, data, token),
  deleteSubtask: (token, id) => apiRequest('DELETE', `/subtasks/${id}`, null, token),
}

export default apiClient

