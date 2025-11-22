import { z } from 'zod'

/**
 * Validate UUID
 */
export const uuidSchema = z.string().uuid('Invalid UUID format')

/**
 * Validate pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  offset: z.coerce.number().int().min(0).optional(),
}).passthrough() // Allow additional query parameters like project_id, roadmap_id, task_id

/**
 * Validate sort parameters
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
})

/**
 * Project validation schemas
 */
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['active', 'completed', 'archived']).default('active').optional(),
  database_schema: z.any().optional().nullable(), // JSONB type - accepts any JSON value
})

export const updateProjectSchema = createProjectSchema.partial()

/**
 * Stack validation schemas
 */
export const createStackSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
})

export const updateStackSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
})

/**
 * Roadmap validation schemas
 */
export const createRoadmapSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['draft', 'active', 'completed']).default('draft').optional(),
})

export const updateRoadmapSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['draft', 'active', 'completed']).optional(),
})

/**
 * Task validation schemas
 */
export const createTaskSchema = z.object({
  roadmap_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked']).default('pending').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium').optional(),
  due_date: z.string().datetime().optional().nullable(),
})

export const updateTaskSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().datetime().optional().nullable(),
})

/**
 * Subtask validation schemas
 */
export const createSubtaskSchema = z.object({
  task_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  completed: z.boolean().default(false).optional(),
})

export const updateSubtaskSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  completed: z.boolean().optional(),
})

/**
 * Validate request body
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid request data',
          details: error.errors,
        })
      }
      next(error)
    }
  }
}

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and validate - .passthrough() preserves unknown fields like project_id
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid query parameters',
          details: error.errors,
        })
      }
      next(error)
    }
  }
}

/**
 * Validate UUID parameter
 */
export const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      const id = req.params[paramName]
      uuidSchema.parse(id)
      next()
    } catch (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Invalid ${paramName}: must be a valid UUID`,
      })
    }
  }
}

