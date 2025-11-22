// Use req.supabase from auth middleware

/**
 * Get all roadmaps for a project
 */
export const getRoadmaps = async (req, res, next) => {
  console.log('🎯 [CONTROLLER] getRoadmaps function called!')
  console.log('🎯 [CONTROLLER] Timestamp:', new Date().toISOString())
  
  try {
    const { project_id } = req.query
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    // Log incoming request
    console.log('=== ROADMAPS API REQUEST ===')
    console.log('Request query params:', JSON.stringify(req.query, null, 2))
    console.log('Project ID from query:', project_id)
    console.log('Project ID type:', typeof project_id)
    console.log('Page:', page, '(type:', typeof page, ')')
    console.log('Limit:', limit, '(type:', typeof limit, ')')
    console.log('Offset:', offset)
    console.log('User:', req.user?.id, req.user?.email)
    console.log('============================')

    if (!project_id) {
      console.error('❌ Missing project_id in query params')
      return res.status(400).json({
        error: 'Bad Request',
        message: 'project_id is required',
      })
    }

    // Log the query being constructed
    console.log('=== EXECUTING SUPABASE QUERY ===')
    console.log('Query: SELECT * FROM roadmaps')
    console.log('WHERE project_id =', project_id)
    console.log('ORDER BY created_at DESC')
    console.log('RANGE:', offset, 'to', offset + limit - 1)
    console.log('COUNT: exact')
    console.log('User ID:', req.user?.id)
    console.log('User email:', req.user?.email)
    console.log('================================')

    // First, let's check if the project exists and belongs to the user
    console.log('🔍 [DEBUG] Checking if project exists...')
    const { data: projectCheck, error: projectError } = await req.supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('id', project_id)
      .single()

    if (projectError) {
      console.error('❌ [DEBUG] Error checking project:', projectError)
    } else {
      console.log('✅ [DEBUG] Project found:', JSON.stringify(projectCheck, null, 2))
      console.log('🔍 [DEBUG] Project user_id:', projectCheck?.user_id)
      console.log('🔍 [DEBUG] Current user_id:', req.user?.id)
      console.log('🔍 [DEBUG] User IDs match:', projectCheck?.user_id === req.user?.id)
    }

    // Check all roadmaps for this project (without RLS if possible, or check directly)
    console.log('🔍 [DEBUG] Checking all roadmaps in database (raw query)...')
    const { data: allRoadmaps, error: allError } = await req.supabase
      .from('roadmaps')
      .select('*')
      .eq('project_id', project_id)

    if (allError) {
      console.error('❌ [DEBUG] Error fetching all roadmaps:', allError)
    } else {
      console.log('🔍 [DEBUG] All roadmaps found (before pagination):', allRoadmaps?.length || 0)
      console.log('🔍 [DEBUG] Roadmaps data:', JSON.stringify(allRoadmaps, null, 2))
    }

    // RLS will verify project belongs to user
    console.log('🔍 [DEBUG] Executing paginated query...')
    const { data, error, count } = await req.supabase
      .from('roadmaps')
      .select('*', { count: 'exact' })
      .eq('project_id', project_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('❌ Error fetching roadmaps from database:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      throw error
    }

    // Log the response data
    console.log('=== ROADMAPS API RESPONSE ===')
    console.log('Project ID:', project_id)
    console.log('Roadmaps count from DB:', count)
    console.log('Roadmaps data length:', data?.length || 0)
    console.log('Roadmaps data:', JSON.stringify(data, null, 2))
    console.log('Pagination:', {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit),
    })
    console.log('=============================')

    const response = {
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }

    console.log('Full API response being sent:', JSON.stringify(response, null, 2))
    console.log('Response data array length:', response.data?.length || 0)

    res.json(response)
  } catch (error) {
    console.error('❌ Exception in getRoadmaps:', error)
    next(error)
  }
}

/**
 * Get a single roadmap by ID with tasks and subtasks
 */
export const getRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: roadmap, error } = await req.supabase
      .from('roadmaps')
      .select('*, tasks(*, subtasks(*))')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Roadmap not found',
        })
      }
      throw error
    }

    res.json({
      success: true,
      data: roadmap,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new roadmap
 */
export const createRoadmap = async (req, res, next) => {
  try {
    const { project_id } = req.body

    // RLS will verify project belongs to user
    const roadmapData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('roadmaps')
      .insert(roadmapData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Roadmap created successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a roadmap
 */
export const updateRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify roadmap belongs to user's project
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await req.supabase
      .from('roadmaps')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
      message: 'Roadmap updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a roadmap
 */
export const deleteRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params

    // RLS will verify roadmap belongs to user's project
    const { error } = await req.supabase.from('roadmaps').delete().eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Roadmap deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

