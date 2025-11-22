import express from 'express'
import {
  getStacks,
  getStack,
  createStack,
  updateStack,
  deleteStack,
} from '../controllers/stacksController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validate,
  validateQuery,
  validateUUID,
  createStackSchema,
  updateStackSchema,
  paginationSchema,
} from '../utils/validation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/stacks - Get all stacks (optionally filtered by project_id)
router.get(
  '/',
  validateQuery(paginationSchema),
  getStacks
)

// GET /api/stacks/:id - Get a single stack
router.get('/:id', validateUUID('id'), getStack)

// POST /api/stacks - Create a new stack
router.post('/', validate(createStackSchema), createStack)

// PUT /api/stacks/:id - Update a stack
router.put('/:id', validateUUID('id'), validate(updateStackSchema), updateStack)

// DELETE /api/stacks/:id - Delete a stack
router.delete('/:id', validateUUID('id'), deleteStack)

export default router

