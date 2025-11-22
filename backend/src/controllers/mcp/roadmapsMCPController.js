import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List roadmaps
 */
export const listRoadmaps = async (req, res, next) => {
  try {
    const { project_id, page = 1, limit = 10 } = req.body

    if (!project_id) {
      return res.status(400).json({
        tool: 'list_roadmaps',
        success: false,
        error: 'project_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.getRoadmaps( { project_id, page, limit })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'list_roadmaps',
        ...result,
      })
    }

    res.json({
      tool: 'list_roadmaps',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Get roadmap
 */
export const getRoadmap = async (req, res, next) => {
  try {
    const { roadmap_id } = req.body

    if (!roadmap_id) {
      return res.status(400).json({
        tool: 'get_roadmap',
        success: false,
        error: 'roadmap_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.getRoadmap(roadmap_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'get_roadmap',
        ...result,
      })
    }

    res.json({
      tool: 'get_roadmap',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Create roadmap
 */
export const createRoadmap = async (req, res, next) => {
  try {
    const { project_id, name, description, status } = req.body

    if (!project_id || !name) {
      return res.status(400).json({
        tool: 'create_roadmap',
        success: false,
        error: 'project_id and name are required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.createRoadmap({
      project_id,
      name,
      description,
      status,
    })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'create_roadmap',
        ...result,
      })
    }

    res.json({
      tool: 'create_roadmap',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Update roadmap
 */
export const updateRoadmap = async (req, res, next) => {
  try {
    const { roadmap_id, name, description, status } = req.body

    if (!roadmap_id) {
      return res.status(400).json({
        tool: 'update_roadmap',
        success: false,
        error: 'roadmap_id is required',
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status

    // No token needed - backend uses service role key internally
    const result = await apiClient.updateRoadmap(roadmap_id, updateData)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'update_roadmap',
        ...result,
      })
    }

    res.json({
      tool: 'update_roadmap',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Delete roadmap
 */
export const deleteRoadmap = async (req, res, next) => {
  try {
    const { roadmap_id } = req.body

    if (!roadmap_id) {
      return res.status(400).json({
        tool: 'delete_roadmap',
        success: false,
        error: 'roadmap_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.deleteRoadmap(roadmap_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'delete_roadmap',
        ...result,
      })
    }

    res.json({
      tool: 'delete_roadmap',
      success: true,
      result: { message: 'Roadmap deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}



