import express from 'express'
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasksController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validate,
  validateQuery,
  validateUUID,
  createTaskSchema,
  updateTaskSchema,
  paginationSchema,
} from '../utils/validation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/tasks - Get all tasks (requires roadmap_id query param)
router.get(
  '/',
  validateQuery(paginationSchema),
  getTasks
)

// GET /api/tasks/:id - Get a single task with subtasks
router.get('/:id', validateUUID('id'), getTask)

// POST /api/tasks - Create a new task
router.post('/', validate(createTaskSchema), createTask)

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateUUID('id'), validate(updateTaskSchema), updateTask)

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateUUID('id'), deleteTask)

export default router

