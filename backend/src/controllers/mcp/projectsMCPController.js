import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List projects
 * Authentication is handled by the backend server using service role key
 */
export const listProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.body

    console.log('🔧 [MCP] listProjects called')
    console.log('🔧 [MCP] Request body:', { page, limit })

    // No token needed - backend uses service role key internally
    const result = await apiClient.getProjects({ page, limit })

    if (!result.success) {
      console.error('❌ [MCP] API client returned error:', result)
      return res.status(result.status || 500).json({
        tool: 'list_projects',
        ...result,
      })
    }

    console.log('✅ [MCP] listProjects succeeded')
    res.json({
      tool: 'list_projects',
      success: true,
      result: result.data,
    })
  } catch (error) {
    console.error('❌ [MCP] listProjects error:', error)
    next(error)
  }
}

/**
 * MCP tool: Get project
 * Authentication is handled by the backend server using service role key
 */
export const getProject = async (req, res, next) => {
  try {
    const { project_id } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'get_project',
        success: false,
        error: 'project_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.getProject(project_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'get_project',
        ...result,
      })
    }

    res.json({
      tool: 'get_project',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Create project
 * Authentication is handled by the backend server using service role key
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, database_schema } = req.body

    if (!name) {
      return res.status(400).json({
        tool: 'create_project',
        success: false,
        error: 'name is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.createProject({
      name,
      description,
      status,
      database_schema,
    })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'create_project',
        ...result,
      })
    }

    res.json({
      tool: 'create_project',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Update project
 * Authentication is handled by the backend server using service role key
 */
export const updateProject = async (req, res, next) => {
  try {
    const { project_id, name, description, status, database_schema } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'update_project',
        success: false,
        error: 'project_id is required',
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (database_schema !== undefined) updateData.database_schema = database_schema

    // No token needed - backend uses service role key internally
    const result = await apiClient.updateProject(project_id, updateData)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'update_project',
        ...result,
      })
    }

    res.json({
      tool: 'update_project',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Delete project
 * Authentication is handled by the backend server using service role key
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { project_id } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'delete_project',
        success: false,
        error: 'project_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.deleteProject(project_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'delete_project',
        ...result,
      })
    }

    res.json({
      tool: 'delete_project',
      success: true,
      result: { message: 'Project deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}

