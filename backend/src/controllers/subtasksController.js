// Use req.supabase from auth middleware

/**
 * Get all subtasks for a task
 */
export const getSubtasks = async (req, res, next) => {
  try {
    const { task_id } = req.query
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    if (!task_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'task_id is required',
      })
    }

    // RLS will verify task belongs to user's project
    const { data, error, count } = await req.supabase
      .from('subtasks')
      .select('*', { count: 'exact' })
      .eq('task_id', task_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get a single subtask by ID
 */
export const getSubtask = async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: subtask, error } = await req.supabase
      .from('subtasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Subtask not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data: subtask,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new subtask
 */
export const createSubtask = async (req, res, next) => {
  try {
    const { task_id } = req.body

    // RLS will verify task belongs to user's project
    const subtaskData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('subtasks')
      .insert(subtaskData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Subtask created successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a subtask
 */
export const updateSubtask = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify subtask belongs to user's project
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('subtasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
      message: 'Subtask updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a subtask
 */
export const deleteSubtask = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify subtask belongs to user's project
    const { error } = await req.supabase.from('subtasks').delete().eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Subtask deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

