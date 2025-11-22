# Backend Routes Summary

## Overview

The backend exposes two sets of routes:

1. **REST API** (`/api/*`) - For frontend applications
2. **MCP Tools** (`/mcp/*`) - For AI applications (Model Context Protocol)

Both routes use the same underlying REST API endpoints internally, ensuring consistency.

## REST API Routes (`/api/*`)

Standard REST API endpoints for frontend applications:

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Stacks
- `GET /api/stacks` - List all stacks
- `GET /api/stacks/:id` - Get a single stack
- `POST /api/stacks` - Create a new stack
- `PUT /api/stacks/:id` - Update a stack
- `DELETE /api/stacks/:id` - Delete a stack

### Roadmaps
- `GET /api/roadmaps` - List all roadmaps
- `GET /api/roadmaps/:id` - Get a single roadmap (with tasks and subtasks)
- `POST /api/roadmaps` - Create a new roadmap
- `PUT /api/roadmaps/:id` - Update a roadmap
- `DELETE /api/roadmaps/:id` - Delete a roadmap

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get a single task (with subtasks)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Subtasks
- `GET /api/subtasks` - List all subtasks
- `GET /api/subtasks/:id` - Get a single subtask
- `POST /api/subtasks` - Create a new subtask
- `PUT /api/subtasks/:id` - Update a subtask
- `DELETE /api/subtasks/:id` - Delete a subtask

## MCP Tools Routes (`/mcp/*`)

AI-friendly interface for Model Context Protocol:

### Tools Discovery
- `GET /mcp/tools` - List all available MCP tools (public, no auth required)

### Projects Tools
- `POST /mcp/projects/list` - List all projects
- `POST /mcp/projects/get` - Get a single project
- `POST /mcp/projects/create` - Create a new project
- `POST /mcp/projects/update` - Update a project
- `POST /mcp/projects/delete` - Delete a project

### Stacks Tools
- `POST /mcp/stacks/list` - List all stacks
- `POST /mcp/stacks/get` - Get a single stack
- `POST /mcp/stacks/create` - Create a new stack
- `POST /mcp/stacks/update` - Update a stack
- `POST /mcp/stacks/delete` - Delete a stack

### Roadmaps Tools
- `POST /mcp/roadmaps/list` - List all roadmaps
- `POST /mcp/roadmaps/get` - Get a single roadmap
- `POST /mcp/roadmaps/create` - Create a new roadmap
- `POST /mcp/roadmaps/update` - Update a roadmap
- `POST /mcp/roadmaps/delete` - Delete a roadmap

### Tasks Tools
- `POST /mcp/tasks/list` - List all tasks
- `POST /mcp/tasks/get` - Get a single task
- `POST /mcp/tasks/create` - Create a new task
- `POST /mcp/tasks/update` - Update a task
- `POST /mcp/tasks/delete` - Delete a task

### Subtasks Tools
- `POST /mcp/subtasks/list` - List all subtasks
- `POST /mcp/subtasks/get` - Get a single subtask
- `POST /mcp/subtasks/create` - Create a new subtask
- `POST /mcp/subtasks/update` - Update a subtask
- `POST /mcp/subtasks/delete` - Delete a subtask

## Authentication

- **REST API routes**: Require authentication via Bearer token
- **MCP Tools routes**: Require authentication via Bearer token (except `/mcp/tools`)
- **Tools discovery**: Public endpoint (no auth required)

## Architecture

### MCP Tools Architecture

MCP tools **do not directly access the database**. Instead:

1. MCP controllers receive requests from AI applications
2. MCP controllers call the internal REST API endpoints (`/api/*`) via HTTP
3. REST API endpoints handle database operations
4. Results are returned in MCP format

This ensures:
- ✅ Single source of truth (REST API)
- ✅ Consistent validation and error handling
- ✅ Reusable business logic
- ✅ Easy to maintain and test

### Request Flow

```
AI Application
    ↓
MCP Tool (POST /mcp/projects/create)
    ↓
MCP Controller (projectsMCPController.js)
    ↓
API Client (utils/mcp/apiClient.js)
    ↓
REST API (POST /api/projects)
    ↓
REST Controller (projectsController.js)
    ↓
Supabase (Database)
```

## Response Format

### REST API Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### MCP Tools Response
```json
{
  "tool": "tool_name",
  "success": true,
  "result": { ... }
}
```

## Examples

### REST API Example
```bash
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### MCP Tools Example
```bash
curl -X POST http://localhost:3001/mcp/projects/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Tools Discovery Example
```bash
curl http://localhost:3001/mcp/tools
```

## Notes

- All routes (except `/mcp/tools`) require authentication
- MCP tools call REST API endpoints internally
- Both routes share the same authentication and validation
- MCP tools provide a consistent interface for AI applications
- REST API provides a standard REST interface for frontend applications



