import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * MCP Handler Edge Function
 * Handles all Model Context Protocol (MCP) tool actions for InsightFlow
 * 
 * Endpoints:
 * - GET /tools - List all available MCP tools (public, no auth)
 * - POST /{tool_name} - Execute an MCP tool (requires auth)
 * 
 * Example tool names:
 * - projects/list, projects/get, projects/create, projects/update, projects/delete
 * - stacks/list, stacks/get, stacks/create, stacks/update, stacks/delete
 * - roadmaps/list, roadmaps/get, roadmaps/create, roadmaps/update, roadmaps/delete
 * - tasks/list, tasks/get, tasks/create, tasks/update, tasks/delete
 * - subtasks/list, subtasks/get, subtasks/create, subtasks/update, subtasks/delete
 */

interface MCPRequest {
  tool: string
  [key: string]: any
}

interface MCPResponse {
  tool?: string
  success: boolean
  result?: any
  error?: string
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    // Extract path - handle both local and cloud deployments
    let path = url.pathname
    if (path.includes('/functions/v1/mcp-handler')) {
      path = path.replace('/functions/v1/mcp-handler', '') || '/'
    }
    // Also handle if path is just the function name
    if (path === '/mcp-handler') {
      path = '/'
    }
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    
    // Tools discovery endpoint (public, works with anon key)
    if (req.method === 'GET' && (path === '/tools' || path.endsWith('/tools'))) {
      return new Response(
        JSON.stringify(getToolsList()),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // All other endpoints require POST and authentication
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed',
          message: 'Only POST requests are accepted for MCP tools. Use GET /tools for tools discovery.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        },
      )
    }

    // Get authentication token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          message: 'Missing or invalid authorization header. Use Bearer token for authenticated endpoints.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Parse request body
    const body: MCPRequest = await req.json()
    const toolName = body.tool || path.replace('/', '')

    if (!toolName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Bad Request',
          message: 'Tool name is required. Provide "tool" in request body or in URL path.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Route to appropriate handler
    const result = await handleMCPTool(supabase, user.id, toolName, body)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : (result.error === 'Unauthorized' ? 401 : result.error === 'Not Found' ? 404 : 400),
      },
    )
  } catch (error) {
    console.error('MCP Handler Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/**
 * Get list of available MCP tools
 */
function getToolsList() {
  return {
    tools: [
      // Projects
      {
        name: 'projects/list',
        description: 'List all projects',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      {
        name: 'projects/get',
        description: 'Get a single project by ID',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'projects/create',
        description: 'Create a new project',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
            database_schema: { type: 'object', description: 'Database schema as JSONB object' },
          },
          required: ['name'],
        },
      },
      {
        name: 'projects/update',
        description: 'Update an existing project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            database_schema: { type: 'object', description: 'Database schema as JSONB object' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'projects/delete',
        description: 'Delete a project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
          },
          required: ['project_id'],
        },
      },
      // Stacks
      {
        name: 'stacks/list',
        description: 'List stacks (optionally filtered by project_id)',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      {
        name: 'stacks/get',
        description: 'Get a single stack by ID',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      {
        name: 'stacks/create',
        description: 'Create a new stack',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            technology: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['project_id', 'name'],
        },
      },
      {
        name: 'stacks/update',
        description: 'Update an existing stack',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
            name: { type: 'string' },
            technology: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      {
        name: 'stacks/delete',
        description: 'Delete a stack',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      // Roadmaps
      {
        name: 'roadmaps/list',
        description: 'List roadmaps for a project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'roadmaps/get',
        description: 'Get a single roadmap with tasks and subtasks',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'roadmaps/create',
        description: 'Create a new roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'active', 'completed'] },
          },
          required: ['project_id', 'name'],
        },
      },
      {
        name: 'roadmaps/update',
        description: 'Update an existing roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'roadmaps/delete',
        description: 'Delete a roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      // Tasks
      {
        name: 'tasks/list',
        description: 'List tasks for a roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'tasks/get',
        description: 'Get a single task with subtasks',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'tasks/create',
        description: 'Create a new task',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            due_date: { type: 'string' },
          },
          required: ['roadmap_id', 'name'],
        },
      },
      {
        name: 'tasks/update',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            priority: { type: 'string' },
            due_date: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'tasks/delete',
        description: 'Delete a task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      // Subtasks
      {
        name: 'subtasks/list',
        description: 'List subtasks for a task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'subtasks/get',
        description: 'Get a single subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
          },
          required: ['subtask_id'],
        },
      },
      {
        name: 'subtasks/create',
        description: 'Create a new subtask',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
          required: ['task_id', 'name'],
        },
      },
      {
        name: 'subtasks/update',
        description: 'Update an existing subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
          required: ['subtask_id'],
        },
      },
      {
        name: 'subtasks/delete',
        description: 'Delete a subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
          },
          required: ['subtask_id'],
        },
      },
    ],
  }
}

/**
 * Route MCP tool request to appropriate handler
 */
async function handleMCPTool(
  supabase: any,
  userId: string,
  toolName: string,
  body: any
): Promise<MCPResponse> {
  const [resource, action] = toolName.split('/')

  switch (resource) {
    case 'projects':
      return handleProjectsTool(supabase, userId, action, body)
    case 'stacks':
      return handleStacksTool(supabase, userId, action, body)
    case 'roadmaps':
      return handleRoadmapsTool(supabase, userId, action, body)
    case 'tasks':
      return handleTasksTool(supabase, userId, action, body)
    case 'subtasks':
      return handleSubtasksTool(supabase, userId, action, body)
    default:
      return {
        tool: toolName,
        success: false,
        error: 'Bad Request',
        message: `Unknown tool: ${toolName}`,
      }
  }
}

/**
 * Handle Projects MCP tools
 */
async function handleProjectsTool(
  supabase: any,
  userId: string,
  action: string,
  body: any
): Promise<MCPResponse> {
  switch (action) {
    case 'list': {
      const { page = 1, limit = 10 } = body
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { tool: 'projects/list', success: false, error: error.message }
      }

      return {
        tool: 'projects/list',
        success: true,
        result: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      }
    }

    case 'get': {
      const { project_id } = body
      if (!project_id) {
        return { tool: 'projects/get', success: false, error: 'project_id is required' }
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', project_id)
        .single()

      if (error) {
        return { tool: 'projects/get', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'projects/get', success: true, result: data }
    }

    case 'create': {
      const { name, description, status, database_schema } = body
      if (!name) {
        return { tool: 'projects/create', success: false, error: 'name is required' }
      }

      const projectData: any = {
        name,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (description !== undefined) projectData.description = description
      if (status !== undefined) projectData.status = status
      if (database_schema !== undefined) projectData.database_schema = database_schema

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (error) {
        return { tool: 'projects/create', success: false, error: error.message }
      }

      return { tool: 'projects/create', success: true, result: data }
    }

    case 'update': {
      const { project_id, name, description, status, database_schema } = body
      if (!project_id) {
        return { tool: 'projects/update', success: false, error: 'project_id is required' }
      }

      const updateData: any = { updated_at: new Date().toISOString() }
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (status !== undefined) updateData.status = status
      if (database_schema !== undefined) updateData.database_schema = database_schema

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project_id)
        .select()
        .single()

      if (error) {
        return { tool: 'projects/update', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'projects/update', success: true, result: data }
    }

    case 'delete': {
      const { project_id } = body
      if (!project_id) {
        return { tool: 'projects/delete', success: false, error: 'project_id is required' }
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project_id)

      if (error) {
        return { tool: 'projects/delete', success: false, error: error.message }
      }

      return { tool: 'projects/delete', success: true, result: { message: 'Project deleted successfully' } }
    }

    default:
      return { tool: `projects/${action}`, success: false, error: `Unknown action: ${action}` }
  }
}

/**
 * Handle Stacks MCP tools
 */
async function handleStacksTool(
  supabase: any,
  userId: string,
  action: string,
  body: any
): Promise<MCPResponse> {
  switch (action) {
    case 'list': {
      const { project_id, page = 1, limit = 10 } = body
      const offset = (page - 1) * limit

      let query = supabase.from('stacks').select('*', { count: 'exact' })
      
      if (project_id) {
        query = query.eq('project_id', project_id)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { tool: 'stacks/list', success: false, error: error.message }
      }

      return {
        tool: 'stacks/list',
        success: true,
        result: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      }
    }

    case 'get': {
      const { stack_id } = body
      if (!stack_id) {
        return { tool: 'stacks/get', success: false, error: 'stack_id is required' }
      }

      const { data, error } = await supabase
        .from('stacks')
        .select('*')
        .eq('id', stack_id)
        .single()

      if (error) {
        return { tool: 'stacks/get', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'stacks/get', success: true, result: data }
    }

    case 'create': {
      const { project_id, name, technology, description } = body
      if (!project_id || !name) {
        return { tool: 'stacks/create', success: false, error: 'project_id and name are required' }
      }

      const stackData: any = {
        project_id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (technology !== undefined) stackData.technology = technology
      if (description !== undefined) stackData.description = description

      const { data, error } = await supabase
        .from('stacks')
        .insert(stackData)
        .select()
        .single()

      if (error) {
        return { tool: 'stacks/create', success: false, error: error.message }
      }

      return { tool: 'stacks/create', success: true, result: data }
    }

    case 'update': {
      const { stack_id, name, technology, description } = body
      if (!stack_id) {
        return { tool: 'stacks/update', success: false, error: 'stack_id is required' }
      }

      const updateData: any = { updated_at: new Date().toISOString() }
      if (name !== undefined) updateData.name = name
      if (technology !== undefined) updateData.technology = technology
      if (description !== undefined) updateData.description = description

      const { data, error } = await supabase
        .from('stacks')
        .update(updateData)
        .eq('id', stack_id)
        .select()
        .single()

      if (error) {
        return { tool: 'stacks/update', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'stacks/update', success: true, result: data }
    }

    case 'delete': {
      const { stack_id } = body
      if (!stack_id) {
        return { tool: 'stacks/delete', success: false, error: 'stack_id is required' }
      }

      const { error } = await supabase
        .from('stacks')
        .delete()
        .eq('id', stack_id)

      if (error) {
        return { tool: 'stacks/delete', success: false, error: error.message }
      }

      return { tool: 'stacks/delete', success: true, result: { message: 'Stack deleted successfully' } }
    }

    default:
      return { tool: `stacks/${action}`, success: false, error: `Unknown action: ${action}` }
  }
}

/**
 * Handle Roadmaps MCP tools
 */
async function handleRoadmapsTool(
  supabase: any,
  userId: string,
  action: string,
  body: any
): Promise<MCPResponse> {
  switch (action) {
    case 'list': {
      const { project_id, page = 1, limit = 10 } = body
      if (!project_id) {
        return { tool: 'roadmaps/list', success: false, error: 'project_id is required' }
      }

      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('roadmaps')
        .select('*', { count: 'exact' })
        .eq('project_id', project_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { tool: 'roadmaps/list', success: false, error: error.message }
      }

      return {
        tool: 'roadmaps/list',
        success: true,
        result: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      }
    }

    case 'get': {
      const { roadmap_id } = body
      if (!roadmap_id) {
        return { tool: 'roadmaps/get', success: false, error: 'roadmap_id is required' }
      }

      const { data, error } = await supabase
        .from('roadmaps')
        .select('*, tasks(*, subtasks(*))')
        .eq('id', roadmap_id)
        .single()

      if (error) {
        return { tool: 'roadmaps/get', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'roadmaps/get', success: true, result: data }
    }

    case 'create': {
      const { project_id, name, description, status } = body
      if (!project_id || !name) {
        return { tool: 'roadmaps/create', success: false, error: 'project_id and name are required' }
      }

      const roadmapData: any = {
        project_id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (description !== undefined) roadmapData.description = description
      if (status !== undefined) roadmapData.status = status

      const { data, error } = await supabase
        .from('roadmaps')
        .insert(roadmapData)
        .select()
        .single()

      if (error) {
        return { tool: 'roadmaps/create', success: false, error: error.message }
      }

      return { tool: 'roadmaps/create', success: true, result: data }
    }

    case 'update': {
      const { roadmap_id, name, description, status } = body
      if (!roadmap_id) {
        return { tool: 'roadmaps/update', success: false, error: 'roadmap_id is required' }
      }

      const updateData: any = { updated_at: new Date().toISOString() }
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (status !== undefined) updateData.status = status

      const { data, error } = await supabase
        .from('roadmaps')
        .update(updateData)
        .eq('id', roadmap_id)
        .select()
        .single()

      if (error) {
        return { tool: 'roadmaps/update', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'roadmaps/update', success: true, result: data }
    }

    case 'delete': {
      const { roadmap_id } = body
      if (!roadmap_id) {
        return { tool: 'roadmaps/delete', success: false, error: 'roadmap_id is required' }
      }

      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmap_id)

      if (error) {
        return { tool: 'roadmaps/delete', success: false, error: error.message }
      }

      return { tool: 'roadmaps/delete', success: true, result: { message: 'Roadmap deleted successfully' } }
    }

    default:
      return { tool: `roadmaps/${action}`, success: false, error: `Unknown action: ${action}` }
  }
}

/**
 * Handle Tasks MCP tools
 */
async function handleTasksTool(
  supabase: any,
  userId: string,
  action: string,
  body: any
): Promise<MCPResponse> {
  switch (action) {
    case 'list': {
      const { roadmap_id, page = 1, limit = 10 } = body
      if (!roadmap_id) {
        return { tool: 'tasks/list', success: false, error: 'roadmap_id is required' }
      }

      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('roadmap_id', roadmap_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { tool: 'tasks/list', success: false, error: error.message }
      }

      return {
        tool: 'tasks/list',
        success: true,
        result: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      }
    }

    case 'get': {
      const { task_id } = body
      if (!task_id) {
        return { tool: 'tasks/get', success: false, error: 'task_id is required' }
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks(*)')
        .eq('id', task_id)
        .single()

      if (error) {
        return { tool: 'tasks/get', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'tasks/get', success: true, result: data }
    }

    case 'create': {
      const { roadmap_id, name, description, status, priority, due_date } = body
      if (!roadmap_id || !name) {
        return { tool: 'tasks/create', success: false, error: 'roadmap_id and name are required' }
      }

      const taskData: any = {
        roadmap_id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (description !== undefined) taskData.description = description
      if (status !== undefined) taskData.status = status
      if (priority !== undefined) taskData.priority = priority
      if (due_date !== undefined) taskData.due_date = due_date

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) {
        return { tool: 'tasks/create', success: false, error: error.message }
      }

      return { tool: 'tasks/create', success: true, result: data }
    }

    case 'update': {
      const { task_id, name, description, status, priority, due_date } = body
      if (!task_id) {
        return { tool: 'tasks/update', success: false, error: 'task_id is required' }
      }

      const updateData: any = { updated_at: new Date().toISOString() }
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (status !== undefined) updateData.status = status
      if (priority !== undefined) updateData.priority = priority
      if (due_date !== undefined) updateData.due_date = due_date

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task_id)
        .select()
        .single()

      if (error) {
        return { tool: 'tasks/update', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'tasks/update', success: true, result: data }
    }

    case 'delete': {
      const { task_id } = body
      if (!task_id) {
        return { tool: 'tasks/delete', success: false, error: 'task_id is required' }
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task_id)

      if (error) {
        return { tool: 'tasks/delete', success: false, error: error.message }
      }

      return { tool: 'tasks/delete', success: true, result: { message: 'Task deleted successfully' } }
    }

    default:
      return { tool: `tasks/${action}`, success: false, error: `Unknown action: ${action}` }
  }
}

/**
 * Handle Subtasks MCP tools
 */
async function handleSubtasksTool(
  supabase: any,
  userId: string,
  action: string,
  body: any
): Promise<MCPResponse> {
  switch (action) {
    case 'list': {
      const { task_id, page = 1, limit = 10 } = body
      if (!task_id) {
        return { tool: 'subtasks/list', success: false, error: 'task_id is required' }
      }

      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('subtasks')
        .select('*', { count: 'exact' })
        .eq('task_id', task_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { tool: 'subtasks/list', success: false, error: error.message }
      }

      return {
        tool: 'subtasks/list',
        success: true,
        result: {
          data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      }
    }

    case 'get': {
      const { subtask_id } = body
      if (!subtask_id) {
        return { tool: 'subtasks/get', success: false, error: 'subtask_id is required' }
      }

      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('id', subtask_id)
        .single()

      if (error) {
        return { tool: 'subtasks/get', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'subtasks/get', success: true, result: data }
    }

    case 'create': {
      const { task_id, name, description, completed } = body
      if (!task_id || !name) {
        return { tool: 'subtasks/create', success: false, error: 'task_id and name are required' }
      }

      const subtaskData: any = {
        task_id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (description !== undefined) subtaskData.description = description
      if (completed !== undefined) subtaskData.completed = completed

      const { data, error } = await supabase
        .from('subtasks')
        .insert(subtaskData)
        .select()
        .single()

      if (error) {
        return { tool: 'subtasks/create', success: false, error: error.message }
      }

      return { tool: 'subtasks/create', success: true, result: data }
    }

    case 'update': {
      const { subtask_id, name, description, completed } = body
      if (!subtask_id) {
        return { tool: 'subtasks/update', success: false, error: 'subtask_id is required' }
      }

      const updateData: any = { updated_at: new Date().toISOString() }
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (completed !== undefined) updateData.completed = completed

      const { data, error } = await supabase
        .from('subtasks')
        .update(updateData)
        .eq('id', subtask_id)
        .select()
        .single()

      if (error) {
        return { tool: 'subtasks/update', success: false, error: error.code === 'PGRST116' ? 'Not Found' : error.message }
      }

      return { tool: 'subtasks/update', success: true, result: data }
    }

    case 'delete': {
      const { subtask_id } = body
      if (!subtask_id) {
        return { tool: 'subtasks/delete', success: false, error: 'subtask_id is required' }
      }

      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtask_id)

      if (error) {
        return { tool: 'subtasks/delete', success: false, error: error.message }
      }

      return { tool: 'subtasks/delete', success: true, result: { message: 'Subtask deleted successfully' } }
    }

    default:
      return { tool: `subtasks/${action}`, success: false, error: `Unknown action: ${action}` }
  }
}

