/**
 * Get all projects for the authenticated user
 */
export const getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query
    const offset = (page - 1) * limit

    // Use authenticated client from middleware (has RLS enabled)
    const { data, error, count } = await req.supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
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
 * Get a single project by ID
 */
export const getProject = async (req, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await req.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Project not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new project
 */
export const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      user_id: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Project created successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a project
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Project not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: 'Project updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a project
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will handle authorization
    const { error } = await req.supabase.from('projects').delete().eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

