/**
 * Internal API client for MCP tools
 * Calls the REST API endpoints instead of directly accessing the database
 * 
 * This client uses the service role key for authentication - the backend server
 * handles its own authentication, not the user. This allows MCP tools to work
 * without requiring user tokens.
 */

import dotenv from 'dotenv'

dotenv.config()

// Get service role key for backend authentication
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ [API CLIENT] SUPABASE_SERVICE_ROLE_KEY not set - MCP tools may fail')
}

// Get base URL from environment (for OpenAPI schema)
const getBaseServerUrl = () => {
  if (process.env.API_BASE_URL) {
    // Remove trailing slash if present
    return process.env.API_BASE_URL.replace(/\/$/, '')
  }
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL.replace(/\/$/, '')
  }
  return `http://localhost:${process.env.PORT || 3001}`
}

// For internal API calls, we always use /api path
// If we're on the same server (localhost), use localhost for better performance
// Otherwise, use the configured API_BASE_URL with /api appended
const getInternalApiBaseUrl = () => {
  const baseUrl = getBaseServerUrl()
  
  // If it's localhost, use it for internal calls (faster, no network hop)
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    return `${baseUrl}/api`
  }
  
  // For production/external URLs, append /api
  return `${baseUrl}/api`
}

const API_BASE_URL = getInternalApiBaseUrl()

/**
 * Make an internal API request using service role key
 * The backend server authenticates itself using the service role key
 */
async function apiRequest(method, endpoint, data = null) {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log(`🔗 [API CLIENT] ${method} ${url}`)
  console.log(`🔗 [API CLIENT] Using service role key: ${!!SUPABASE_SERVICE_ROLE_KEY}`)
  
  try {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    // Use service role key for backend authentication
    // This allows MCP tools to work without user tokens
    // The backend server authenticates itself using the service role key
    if (SUPABASE_SERVICE_ROLE_KEY) {
      headers['Authorization'] = `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      // Note: We don't need apikey header when using service role key as Bearer token
    } else {
      console.error('❌ [API CLIENT] Service role key not configured')
      return {
        success: false,
        error: 'Internal server error',
        message: 'Service role key not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment variables.',
        status: 500,
      }
    }
    
    const response = await fetch(url, {
      method,
      headers,
      ...(data && (method === 'POST' || method === 'PUT' || method === 'PATCH') && {
        body: JSON.stringify(data),
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error(`❌ [API CLIENT] Request failed: ${response.status} ${response.statusText}`)
      console.error(`❌ [API CLIENT] Error response:`, responseData)
      return {
        success: false,
        error: responseData.error || 'API request failed',
        message: responseData.message || responseData.error,
        status: response.status,
        details: responseData.details,
      }
    }

    console.log(`✅ [API CLIENT] Request succeeded`)
    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message,
      pagination: responseData.pagination,
    }
  } catch (error) {
    console.error('❌ [API CLIENT] Network error:', error.message)
    console.error('❌ [API CLIENT] Error stack:', error.stack)
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500,
    }
  }
}

export const apiClient = {
  // Projects - no token needed, backend uses service role key
  getProjects: (query = {}) =>
    apiRequest('GET', `/projects?${new URLSearchParams(query).toString()}`),
  getProject: (id) => apiRequest('GET', `/projects/${id}`),
  createProject: (data) => apiRequest('POST', '/projects', data),
  updateProject: (id, data) => apiRequest('PUT', `/projects/${id}`, data),
  deleteProject: (id) => apiRequest('DELETE', `/projects/${id}`),

  // Stacks - no token needed, backend uses service role key
  getStacks: (query = {}) =>
    apiRequest('GET', `/stacks?${new URLSearchParams(query).toString()}`),
  getStack: (id) => apiRequest('GET', `/stacks/${id}`),
  createStack: (data) => apiRequest('POST', '/stacks', data),
  updateStack: (id, data) => apiRequest('PUT', `/stacks/${id}`, data),
  deleteStack: (id) => apiRequest('DELETE', `/stacks/${id}`),

  // Roadmaps - no token needed, backend uses service role key
  getRoadmaps: (query = {}) =>
    apiRequest('GET', `/roadmaps?${new URLSearchParams(query).toString()}`),
  getRoadmap: (id) => apiRequest('GET', `/roadmaps/${id}`),
  createRoadmap: (data) => apiRequest('POST', '/roadmaps', data),
  updateRoadmap: (id, data) => apiRequest('PUT', `/roadmaps/${id}`, data),
  deleteRoadmap: (id) => apiRequest('DELETE', `/roadmaps/${id}`),

  // Tasks - no token needed, backend uses service role key
  getTasks: (query = {}) =>
    apiRequest('GET', `/tasks?${new URLSearchParams(query).toString()}`),
  getTask: (id) => apiRequest('GET', `/tasks/${id}`),
  createTask: (data) => apiRequest('POST', '/tasks', data),
  updateTask: (id, data) => apiRequest('PUT', `/tasks/${id}`, data),
  deleteTask: (id) => apiRequest('DELETE', `/tasks/${id}`),

  // Subtasks - no token needed, backend uses service role key
  getSubtasks: (query = {}) =>
    apiRequest('GET', `/subtasks?${new URLSearchParams(query).toString()}`),
  getSubtask: (id) => apiRequest('GET', `/subtasks/${id}`),
  createSubtask: (data) => apiRequest('POST', '/subtasks', data),
  updateSubtask: (id, data) => apiRequest('PUT', `/subtasks/${id}`, data),
  deleteSubtask: (id) => apiRequest('DELETE', `/subtasks/${id}`),
}

export default apiClient

