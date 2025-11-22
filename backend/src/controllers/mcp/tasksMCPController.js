import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List tasks
 */
export const listTasks = async (req, res, next) => {
  try {
    const token = req.token
    const { roadmap_id, page = 1, limit = 10 } = req.body

    if (!roadmap_id) {
      return res.status(400).json({
        tool: 'list_tasks',
        success: false,
        error: 'roadmap_id is required',
      })
    }

    const result = await apiClient.getTasks(token, { roadmap_id, page, limit })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'list_tasks',
        ...result,
      })
    }

    res.json({
      tool: 'list_tasks',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Get task
 */
export const getTask = async (req, res, next) => {
  try {
    const token = req.token
    const { task_id } = req.body

    if (!task_id) {
      return res.status(400).json({
        tool: 'get_task',
        success: false,
        error: 'task_id is required',
      })
    }

    const result = await apiClient.getTask(token, task_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'get_task',
        ...result,
      })
    }

    res.json({
      tool: 'get_task',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Create task
 */
export const createTask = async (req, res, next) => {
  try {
    const token = req.token
    const { roadmap_id, name, description, status, priority, due_date } = req.body

    if (!roadmap_id || !name) {
      return res.status(400).json({
        tool: 'create_task',
        success: false,
        error: 'roadmap_id and name are required',
      })
    }

    const result = await apiClient.createTask(token, {
      roadmap_id,
      name,
      description,
      status,
      priority,
      due_date,
    })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'create_task',
        ...result,
      })
    }

    res.json({
      tool: 'create_task',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Update task
 */
export const updateTask = async (req, res, next) => {
  try {
    const token = req.token
    const { task_id, name, description, status, priority, due_date } = req.body

    if (!task_id) {
      return res.status(400).json({
        tool: 'update_task',
        success: false,
        error: 'task_id is required',
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (due_date !== undefined) updateData.due_date = due_date

    const result = await apiClient.updateTask(token, task_id, updateData)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'update_task',
        ...result,
      })
    }

    res.json({
      tool: 'update_task',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Delete task
 */
export const deleteTask = async (req, res, next) => {
  try {
    const token = req.token
    const { task_id } = req.body

    if (!task_id) {
      return res.status(400).json({
        tool: 'delete_task',
        success: false,
        error: 'task_id is required',
      })
    }

    const result = await apiClient.deleteTask(token, task_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'delete_task',
        ...result,
      })
    }

    res.json({
      tool: 'delete_task',
      success: true,
      result: { message: 'Task deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}



