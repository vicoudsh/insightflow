/**
 * API Client for connecting to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Project {
  id: string
  name: string
  description?: string
  status: string
  database_schema?: any // JSONB type - can be object, array, or null
  user_id: string
  created_at: string
  updated_at: string
}

export interface Stack {
  id: string
  project_id: string
  name: string
  description?: string
  created_at: string
}

export interface Roadmap {
  id: string
  project_id: string
  name: string
  description?: string
  status: string
  tasks?: Task[]
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  roadmap_id: string
  name: string
  description?: string
  status: string
  priority?: string
  due_date?: string
  subtasks?: Subtask[]
  created_at: string
  updated_at: string
}

export interface Subtask {
  id: string
  task_id: string
  name: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface ProjectDetails {
  project: Project
  stacks: Stack[]
  roadmaps: Roadmap[]
}

/**
 * Get authentication token from localStorage or Supabase session
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  
  // First try localStorage (for API calls)
  const storedToken = localStorage.getItem('auth_token')
  if (storedToken) {
    return storedToken
  }

  // If no stored token, try to get from Supabase session
  try {
    const { supabase } = await import('./supabase')
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      localStorage.setItem('auth_token', session.access_token)
      return session.access_token
    }
  } catch (error) {
    console.error('Error getting Supabase session:', error)
  }

  return null
}

/**
 * API request helper
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Copy existing headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value
      })
    } else {
      Object.assign(headers, options.headers)
    }
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const fullUrl = `${API_URL}${endpoint}`
  console.log('🌐 [FRONTEND API REQUEST]')
  console.log('🌐 URL:', fullUrl)
  console.log('🌐 Method:', options.method || 'GET')
  console.log('🌐 Headers:', headers)
  console.log('🌐 Has token:', !!token)
  console.log('🌐 Token preview:', token ? token.substring(0, 20) + '...' : 'none')

  const response = await fetch(fullUrl, {
    ...options,
    headers: headers as HeadersInit,
  })

  console.log('🌐 [FRONTEND API RESPONSE]')
  console.log('🌐 Status:', response.status, response.statusText)
  console.log('🌐 URL:', response.url)
  console.log('🌐 OK:', response.ok)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    console.error('🌐 [FRONTEND API ERROR]', error)
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('🌐 [FRONTEND API RESPONSE DATA]')
  console.log('🌐 Raw data:', JSON.stringify(data, null, 2))
  console.log('🌐 Data type:', typeof data)
  console.log('🌐 Has success:', 'success' in (data || {}))
  console.log('🌐 Has data property:', 'data' in (data || {}))
  
  // Handle both REST API format (data.data) and direct data
  // Check if response has success flag and data property
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    // Return the data array/object (even if empty array)
    // This handles the case where data.data is [] (empty array is valid)
    console.log('🌐 [FRONTEND API] Extracting data.data')
    console.log('🌐 Extracted data:', JSON.stringify(data.data, null, 2))
    console.log('🌐 Extracted data type:', typeof data.data)
    console.log('🌐 Extracted data is array:', Array.isArray(data.data))
    return data.data
  }
  // If response doesn't have the expected format, return as-is
  console.log('🌐 [FRONTEND API] Returning data as-is')
  return data
}

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>('/api/projects')
}

/**
 * Get project details with stacks and roadmaps
 */
export async function getProjectDetails(projectId: string): Promise<ProjectDetails> {
  if (!projectId) {
    throw new Error('project_id is required')
  }

  try {
    // Fetch project first
    const projectResponse = await apiRequest<Project>(`/api/projects/${projectId}`)
    const project = projectResponse

    // Fetch stacks and roadmaps in parallel, with error handling
    let stacks: Stack[] = []
    let roadmaps: Roadmap[] = []

    try {
      const stacksResponse = await apiRequest<{ data: Stack[]; pagination?: any } | Stack[]>(`/api/stacks?project_id=${projectId}`)
      stacks = Array.isArray(stacksResponse) ? stacksResponse : (stacksResponse.data || [])
    } catch (error) {
      console.error('Error fetching stacks:', error)
      stacks = []
    }

    try {
      // Fetch roadmaps - apiRequest should extract data.data automatically
      const roadmapsResponse = await apiRequest<Roadmap[]>(`/api/roadmaps?project_id=${projectId}&limit=100&page=1`)
      
      // apiRequest extracts data.data, so roadmapsResponse should be an array
      if (Array.isArray(roadmapsResponse)) {
        roadmaps = roadmapsResponse
      } else {
        // Fallback: if somehow still wrapped
        console.warn('Roadmaps response not an array:', typeof roadmapsResponse, roadmapsResponse)
        if (roadmapsResponse && typeof roadmapsResponse === 'object' && 'data' in roadmapsResponse && Array.isArray(roadmapsResponse.data)) {
          roadmaps = roadmapsResponse.data
        } else {
          roadmaps = []
        }
      }
    } catch (error) {
      console.error('Error fetching roadmaps for project', projectId, ':', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
      }
      // Set to empty array on error so UI doesn't break
      roadmaps = []
    }

    // Fetch tasks for each roadmap
    const roadmapsWithTasks = await Promise.all(
      roadmaps.map(async (roadmap) => {
        try {
          const tasksResponse = await apiRequest<{ data: Task[]; pagination?: any } | Task[]>(`/api/tasks?roadmap_id=${roadmap.id}`)
          const tasks = Array.isArray(tasksResponse) ? tasksResponse : (tasksResponse.data || [])
          
          // Fetch subtasks for each task
          const tasksWithSubtasks = await Promise.all(
            tasks.map(async (task) => {
              try {
                const subtasksResponse = await apiRequest<{ data: Subtask[]; pagination?: any } | Subtask[]>(`/api/subtasks?task_id=${task.id}`)
                const subtasks = Array.isArray(subtasksResponse) ? subtasksResponse : (subtasksResponse.data || [])
                return { ...task, subtasks }
              } catch (error) {
                console.error(`Error fetching subtasks for task ${task.id}:`, error)
                return { ...task, subtasks: [] }
              }
            })
          )
          return { ...roadmap, tasks: tasksWithSubtasks }
        } catch (error) {
          console.error(`Error fetching tasks for roadmap ${roadmap.id}:`, error)
          return { ...roadmap, tasks: [] }
        }
      })
    )

    return {
      project,
      stacks,
      roadmaps: roadmapsWithTasks,
    }
  } catch (error) {
    console.error('Error in getProjectDetails:', error)
    throw error
  }
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

