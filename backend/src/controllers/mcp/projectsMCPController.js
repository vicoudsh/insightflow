import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List projects
 */
export const listProjects = async (req, res, next) => {
  try {
    const token = req.token
    const { page = 1, limit = 10 } = req.body

    const result = await apiClient.getProjects(token, { page, limit })

    if (!result.success) {
      return res.status(result.status || 500).json(result)
    }

    res.json({
      tool: 'list_projects',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Get project
 */
export const getProject = async (req, res, next) => {
  try {
    const token = req.token
    const { project_id } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'get_project',
        success: false,
        error: 'project_id is required',
      })
    }

    const result = await apiClient.getProject(token, project_id)

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
 */
export const createProject = async (req, res, next) => {
  try {
    const token = req.token
    const { name, description, status, database_schema } = req.body

    if (!name) {
      return res.status(400).json({
        tool: 'create_project',
        success: false,
        error: 'name is required',
      })
    }

    const result = await apiClient.createProject(token, {
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
 */
export const updateProject = async (req, res, next) => {
  try {
    const token = req.token
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

    const result = await apiClient.updateProject(token, project_id, updateData)

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
 */
export const deleteProject = async (req, res, next) => {
  try {
    const token = req.token
    const { project_id } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'delete_project',
        success: false,
        error: 'project_id is required',
      })
    }

    const result = await apiClient.deleteProject(token, project_id)

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

