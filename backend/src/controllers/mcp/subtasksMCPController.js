import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List subtasks
 */
export const listSubtasks = async (req, res, next) => {
  try {
    const token = req.token
    const { task_id, page = 1, limit = 10 } = req.body

    if (!task_id) {
      return res.status(400).json({
        tool: 'list_subtasks',
        success: false,
        error: 'task_id is required',
      })
    }

    const result = await apiClient.getSubtasks(token, { task_id, page, limit })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'list_subtasks',
        ...result,
      })
    }

    res.json({
      tool: 'list_subtasks',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Get subtask
 */
export const getSubtask = async (req, res, next) => {
  try {
    const token = req.token
    const { subtask_id } = req.body

    if (!subtask_id) {
      return res.status(400).json({
        tool: 'get_subtask',
        success: false,
        error: 'subtask_id is required',
      })
    }

    const result = await apiClient.getSubtask(token, subtask_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'get_subtask',
        ...result,
      })
    }

    res.json({
      tool: 'get_subtask',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Create subtask
 */
export const createSubtask = async (req, res, next) => {
  try {
    const token = req.token
    const { task_id, name, description, completed } = req.body

    if (!task_id || !name) {
      return res.status(400).json({
        tool: 'create_subtask',
        success: false,
        error: 'task_id and name are required',
      })
    }

    const result = await apiClient.createSubtask(token, {
      task_id,
      name,
      description,
      completed,
    })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'create_subtask',
        ...result,
      })
    }

    res.json({
      tool: 'create_subtask',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Update subtask
 */
export const updateSubtask = async (req, res, next) => {
  try {
    const token = req.token
    const { subtask_id, name, description, completed } = req.body

    if (!subtask_id) {
      return res.status(400).json({
        tool: 'update_subtask',
        success: false,
        error: 'subtask_id is required',
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (completed !== undefined) updateData.completed = completed

    const result = await apiClient.updateSubtask(token, subtask_id, updateData)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'update_subtask',
        ...result,
      })
    }

    res.json({
      tool: 'update_subtask',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Delete subtask
 */
export const deleteSubtask = async (req, res, next) => {
  try {
    const token = req.token
    const { subtask_id } = req.body

    if (!subtask_id) {
      return res.status(400).json({
        tool: 'delete_subtask',
        success: false,
        error: 'subtask_id is required',
      })
    }

    const result = await apiClient.deleteSubtask(token, subtask_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'delete_subtask',
        ...result,
      })
    }

    res.json({
      tool: 'delete_subtask',
      success: true,
      result: { message: 'Subtask deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}



