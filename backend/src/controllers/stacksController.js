// Use req.supabase from auth middleware

/**
 * Get all stacks for a project
 */
export const getStacks = async (req, res, next) => {
  try {
    const { project_id } = req.query
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = req.supabase
      .from('stacks')
      .select('*', { count: 'exact' })

    // Filter by project_id if provided
    if (project_id) {
      query = query.eq('project_id', project_id)
    }

    const { data, error, count } = await query
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
 * Get a single stack by ID
 */
export const getStack = async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: stack, error } = await req.supabase
      .from('stacks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Stack not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data: stack,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new stack
 */
export const createStack = async (req, res, next) => {
  try {
    const { project_id } = req.body

    // RLS will verify project belongs to user

    const stackData = {
      ...req.body,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('stacks')
      .insert(stackData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Stack created successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a stack
 */
export const updateStack = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify stack belongs to user's project
    const updateData = {
      ...req.body,
    }

    const { data, error } = await req.supabase
      .from('stacks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Stack not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: 'Stack updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a stack
 */
export const deleteStack = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify stack belongs to user's project
    const { error } = await req.supabase.from('stacks').delete().eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Stack deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

