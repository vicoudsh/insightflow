import express from 'express'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validate,
  validateQuery,
  validateUUID,
  createProjectSchema,
  updateProjectSchema,
  paginationSchema,
  sortSchema,
} from '../utils/validation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/projects - Get all projects
router.get(
  '/',
  validateQuery(paginationSchema.merge(sortSchema)),
  getProjects
)

// GET /api/projects/:id - Get a single project
router.get('/:id', validateUUID('id'), getProject)

// POST /api/projects - Create a new project
router.post('/', validate(createProjectSchema), createProject)

// PUT /api/projects/:id - Update a project
router.put('/:id', validateUUID('id'), validate(updateProjectSchema), updateProject)

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', validateUUID('id'), deleteProject)

export default router

