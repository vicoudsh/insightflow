import express from 'express'
import {
  getSubtasks,
  getSubtask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../controllers/subtasksController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validate,
  validateQuery,
  validateUUID,
  createSubtaskSchema,
  updateSubtaskSchema,
  paginationSchema,
} from '../utils/validation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/subtasks - Get all subtasks (requires task_id query param)
router.get(
  '/',
  validateQuery(paginationSchema),
  getSubtasks
)

// GET /api/subtasks/:id - Get a single subtask
router.get('/:id', validateUUID('id'), getSubtask)

// POST /api/subtasks - Create a new subtask
router.post('/', validate(createSubtaskSchema), createSubtask)

// PUT /api/subtasks/:id - Update a subtask
router.put('/:id', validateUUID('id'), validate(updateSubtaskSchema), updateSubtask)

// DELETE /api/subtasks/:id - Delete a subtask
router.delete('/:id', validateUUID('id'), deleteSubtask)

export default router

