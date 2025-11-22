// Use req.supabase from auth middleware

/**
 * Get all tasks for a roadmap
 */
export const getTasks = async (req, res, next) => {
  try {
    const { roadmap_id } = req.query
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    if (!roadmap_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'roadmap_id is required',
      })
    }

    // RLS will verify roadmap belongs to user's project
    const { data, error, count } = await req.supabase
      .from('tasks')
      .select('*, subtasks(*)', { count: 'exact' })
      .eq('roadmap_id', roadmap_id)
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
 * Get a single task by ID with subtasks
 */
export const getTask = async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: task, error } = await req.supabase
      .from('tasks')
      .select('*, subtasks(*)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Task not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new task
 */
export const createTask = async (req, res, next) => {
  try {
    const { roadmap_id } = req.body

    // RLS will verify roadmap belongs to user's project
    const taskData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Task created successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a task
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify task belongs to user's project
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
      message: 'Task updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a task
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify task belongs to user's project
    const { error } = await req.supabase.from('tasks').delete().eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

