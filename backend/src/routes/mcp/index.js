import express from 'express'
import { authenticate } from '../../middleware/auth.js'

// Import MCP controllers
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../../controllers/mcp/projectsMCPController.js'

import {
  listStacks,
  getStack,
  createStack,
  updateStack,
  deleteStack,
} from '../../controllers/mcp/stacksMCPController.js'

import {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from '../../controllers/mcp/roadmapsMCPController.js'

import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../../controllers/mcp/tasksMCPController.js'

import {
  listSubtasks,
  getSubtask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../../controllers/mcp/subtasksMCPController.js'

const router = express.Router()

// Tools list endpoint (public for discovery - no auth required)
router.get('/tools', (req, res) => {
  res.json({
    tools: [
      // Projects
      {
        name: 'projects/list',
        description: 'List all projects',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      {
        name: 'projects/get',
        description: 'Get a single project by ID',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'projects/create',
        description: 'Create a new project',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
            database_schema: { type: 'object', description: 'Database schema as JSONB object' },
          },
          required: ['name'],
        },
      },
      {
        name: 'projects/update',
        description: 'Update an existing project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            database_schema: { type: 'object', description: 'Database schema as JSONB object' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'projects/delete',
        description: 'Delete a project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
          },
          required: ['project_id'],
        },
      },
      // Stacks
      {
        name: 'stacks/list',
        description: 'List stacks (optionally filtered by project_id)',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      {
        name: 'stacks/get',
        description: 'Get a single stack by ID',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      {
        name: 'stacks/create',
        description: 'Create a new stack',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            technology: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['project_id', 'name'],
        },
      },
      {
        name: 'stacks/update',
        description: 'Update an existing stack',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
            name: { type: 'string' },
            technology: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      {
        name: 'stacks/delete',
        description: 'Delete a stack',
        inputSchema: {
          type: 'object',
          properties: {
            stack_id: { type: 'string' },
          },
          required: ['stack_id'],
        },
      },
      // Roadmaps
      {
        name: 'roadmaps/list',
        description: 'List roadmaps for a project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'roadmaps/get',
        description: 'Get a single roadmap with tasks and subtasks',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'roadmaps/create',
        description: 'Create a new roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'active', 'completed'] },
          },
          required: ['project_id', 'name'],
        },
      },
      {
        name: 'roadmaps/update',
        description: 'Update an existing roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'roadmaps/delete',
        description: 'Delete a roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
          },
          required: ['roadmap_id'],
        },
      },
      // Tasks
      {
        name: 'tasks/list',
        description: 'List tasks for a roadmap',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['roadmap_id'],
        },
      },
      {
        name: 'tasks/get',
        description: 'Get a single task with subtasks',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'tasks/create',
        description: 'Create a new task',
        inputSchema: {
          type: 'object',
          properties: {
            roadmap_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            due_date: { type: 'string' },
          },
          required: ['roadmap_id', 'name'],
        },
      },
      {
        name: 'tasks/update',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            priority: { type: 'string' },
            due_date: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'tasks/delete',
        description: 'Delete a task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
          },
          required: ['task_id'],
        },
      },
      // Subtasks
      {
        name: 'subtasks/list',
        description: 'List subtasks for a task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'subtasks/get',
        description: 'Get a single subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
          },
          required: ['subtask_id'],
        },
      },
      {
        name: 'subtasks/create',
        description: 'Create a new subtask',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
          required: ['task_id', 'name'],
        },
      },
      {
        name: 'subtasks/update',
        description: 'Update an existing subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
          required: ['subtask_id'],
        },
      },
      {
        name: 'subtasks/delete',
        description: 'Delete a subtask',
        inputSchema: {
          type: 'object',
          properties: {
            subtask_id: { type: 'string' },
          },
          required: ['subtask_id'],
        },
      },
    ],
  })
})

// MCP routes use service role authentication (backend handles auth, not users)
// No authentication middleware needed - backend uses service role key internally

// Projects MCP tools
router.post('/projects/list', listProjects)
router.post('/projects/get', getProject)
router.post('/projects/create', createProject)
router.post('/projects/update', updateProject)
router.post('/projects/delete', deleteProject)

// Stacks MCP tools
router.post('/stacks/list', listStacks)
router.post('/stacks/get', getStack)
router.post('/stacks/create', createStack)
router.post('/stacks/update', updateStack)
router.post('/stacks/delete', deleteStack)

// Roadmaps MCP tools
router.post('/roadmaps/list', listRoadmaps)
router.post('/roadmaps/get', getRoadmap)
router.post('/roadmaps/create', createRoadmap)
router.post('/roadmaps/update', updateRoadmap)
router.post('/roadmaps/delete', deleteRoadmap)

// Tasks MCP tools
router.post('/tasks/list', listTasks)
router.post('/tasks/get', getTask)
router.post('/tasks/create', createTask)
router.post('/tasks/update', updateTask)
router.post('/tasks/delete', deleteTask)

// Subtasks MCP tools
router.post('/subtasks/list', listSubtasks)
router.post('/subtasks/get', getSubtask)
router.post('/subtasks/create', createSubtask)
router.post('/subtasks/update', updateSubtask)
router.post('/subtasks/delete', deleteSubtask)

export default router
