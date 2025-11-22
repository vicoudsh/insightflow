import express from 'express'
import {
  getRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from '../controllers/roadmapsController.js'
import { authenticate } from '../middleware/auth.js'
import {
  validate,
  validateQuery,
  validateUUID,
  createRoadmapSchema,
  updateRoadmapSchema,
  paginationSchema,
} from '../utils/validation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/roadmaps - Get all roadmaps (requires project_id query param)
router.get(
  '/',
  (req, res, next) => {
    console.log('🔍 [ROADMAPS ROUTE] Request received')
    console.log('🔍 [ROADMAPS ROUTE] Method:', req.method)
    console.log('🔍 [ROADMAPS ROUTE] URL:', req.url)
    console.log('🔍 [ROADMAPS ROUTE] Query:', JSON.stringify(req.query, null, 2))
    console.log('🔍 [ROADMAPS ROUTE] Headers:', JSON.stringify(req.headers, null, 2))
    next()
  },
  validateQuery(paginationSchema),
  (req, res, next) => {
    console.log('🔍 [ROADMAPS ROUTE] After validation')
    console.log('🔍 [ROADMAPS ROUTE] Query after validation:', JSON.stringify(req.query, null, 2))
    next()
  },
  getRoadmaps
)

// GET /api/roadmaps/:id - Get a single roadmap with tasks and subtasks
router.get('/:id', validateUUID('id'), getRoadmap)

// POST /api/roadmaps - Create a new roadmap
router.post('/', validate(createRoadmapSchema), createRoadmap)

// PUT /api/roadmaps/:id - Update a roadmap
router.put('/:id', validateUUID('id'), validate(updateRoadmapSchema), updateRoadmap)

// DELETE /api/roadmaps/:id - Delete a roadmap
router.delete('/:id', validateUUID('id'), deleteRoadmap)

export default router

