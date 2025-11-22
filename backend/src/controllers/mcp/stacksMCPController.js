import { apiClient } from '../../utils/mcp/apiClient.js'

/**
 * MCP tool: List stacks
 */
export const listStacks = async (req, res, next) => {
  try {
    const { project_id, page = 1, limit = 10 } = req.body

    const query = { page, limit }
    if (project_id) query.project_id = project_id

    // No token needed - backend uses service role key internally
    const result = await apiClient.getStacks(query)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'list_stacks',
        ...result,
      })
    }

    res.json({
      tool: 'list_stacks',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Get stack
 */
export const getStack = async (req, res, next) => {
  try {
    const { stack_id } = req.body

    if (!stack_id) {
      return res.status(400).json({
        tool: 'get_stack',
        success: false,
        error: 'stack_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.getStack(stack_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'get_stack',
        ...result,
      })
    }

    res.json({
      tool: 'get_stack',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Create stack
 */
export const createStack = async (req, res, next) => {
  try {
    const { project_id, name, description } = req.body

    if (!project_id || !name) {
      return res.status(400).json({
        tool: 'create_stack',
        success: false,
        error: 'project_id and name are required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.createStack({
      project_id,
      name,
      description,
    })

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'create_stack',
        ...result,
      })
    }

    res.json({
      tool: 'create_stack',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Update stack
 */
export const updateStack = async (req, res, next) => {
  try {
    const { stack_id, name, description } = req.body

    if (!stack_id) {
      return res.status(400).json({
        tool: 'update_stack',
        success: false,
        error: 'stack_id is required',
      })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    // No token needed - backend uses service role key internally
    const result = await apiClient.updateStack(stack_id, updateData)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'update_stack',
        ...result,
      })
    }

    res.json({
      tool: 'update_stack',
      success: true,
      result: result.data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * MCP tool: Delete stack
 */
export const deleteStack = async (req, res, next) => {
  try {
    const { stack_id } = req.body

    if (!stack_id) {
      return res.status(400).json({
        tool: 'delete_stack',
        success: false,
        error: 'stack_id is required',
      })
    }

    // No token needed - backend uses service role key internally
    const result = await apiClient.deleteStack(stack_id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        tool: 'delete_stack',
        ...result,
      })
    }

    res.json({
      tool: 'delete_stack',
      success: true,
      result: { message: 'Stack deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}



