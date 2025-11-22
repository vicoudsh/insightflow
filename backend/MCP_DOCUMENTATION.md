# MCP (Model Context Protocol) Tools Documentation

MCP tools provide an interface for AI applications to interact with the InsightFlow backend. These tools call the REST API endpoints internally.

## Base URL

```
http://localhost:3001/mcp
```

## Authentication

All MCP endpoints require authentication via Bearer token:

```
Authorization: Bearer <user_access_token>
```

## Available Tools

### Projects Tools

#### List Projects
```
POST /mcp/projects/list
Body:
{
  "page": 1,
  "limit": 10
}

Response:
{
  "tool": "list_projects",
  "success": true,
  "result": [...]
}
```

#### Get Project
```
POST /mcp/projects/get
Body:
{
  "project_id": "uuid"
}

Response:
{
  "tool": "get_project",
  "success": true,
  "result": { ... }
}
```

#### Create Project
```
POST /mcp/projects/create
Body:
{
  "name": "Project Name",
  "description": "Description (optional)",
  "status": "active" // optional
}

Response:
{
  "tool": "create_project",
  "success": true,
  "result": { ... }
}
```

#### Update Project
```
POST /mcp/projects/update
Body:
{
  "project_id": "uuid",
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "completed" // optional
}

Response:
{
  "tool": "update_project",
  "success": true,
  "result": { ... }
}
```

#### Delete Project
```
POST /mcp/projects/delete
Body:
{
  "project_id": "uuid"
}

Response:
{
  "tool": "delete_project",
  "success": true,
  "result": { "message": "Project deleted successfully" }
}
```

### Stacks Tools

#### List Stacks
```
POST /mcp/stacks/list
Body:
{
  "project_id": "uuid", // optional
  "page": 1,
  "limit": 10
}
```

#### Get Stack
```
POST /mcp/stacks/get
Body:
{
  "stack_id": "uuid"
}
```

#### Create Stack
```
POST /mcp/stacks/create
Body:
{
  "project_id": "uuid",
  "name": "Stack Name",
  "technology": "Technology (optional)",
  "description": "Description (optional)"
}
```

#### Update Stack
```
POST /mcp/stacks/update
Body:
{
  "stack_id": "uuid",
  "name": "Updated Name", // optional
  "technology": "Updated Technology", // optional
  "description": "Updated Description" // optional
}
```

#### Delete Stack
```
POST /mcp/stacks/delete
Body:
{
  "stack_id": "uuid"
}
```

### Roadmaps Tools

#### List Roadmaps
```
POST /mcp/roadmaps/list
Body:
{
  "project_id": "uuid", // required
  "page": 1,
  "limit": 10
}
```

#### Get Roadmap
```
POST /mcp/roadmaps/get
Body:
{
  "roadmap_id": "uuid"
}

Response includes tasks and subtasks
```

#### Create Roadmap
```
POST /mcp/roadmaps/create
Body:
{
  "project_id": "uuid",
  "name": "Roadmap Name",
  "description": "Description (optional)",
  "status": "draft" // optional: 'draft' | 'active' | 'completed'
}
```

#### Update Roadmap
```
POST /mcp/roadmaps/update
Body:
{
  "roadmap_id": "uuid",
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "active" // optional
}
```

#### Delete Roadmap
```
POST /mcp/roadmaps/delete
Body:
{
  "roadmap_id": "uuid"
}
```

### Tasks Tools

#### List Tasks
```
POST /mcp/tasks/list
Body:
{
  "roadmap_id": "uuid", // required
  "page": 1,
  "limit": 10
}
```

#### Get Task
```
POST /mcp/tasks/get
Body:
{
  "task_id": "uuid"
}

Response includes subtasks
```

#### Create Task
```
POST /mcp/tasks/create
Body:
{
  "roadmap_id": "uuid",
  "name": "Task Name",
  "description": "Description (optional)",
  "status": "pending", // optional: 'pending' | 'in_progress' | 'completed' | 'blocked'
  "priority": "medium", // optional: 'low' | 'medium' | 'high'
  "due_date": "2024-01-01T00:00:00.000Z" // optional, ISO datetime
}
```

#### Update Task
```
POST /mcp/tasks/update
Body:
{
  "task_id": "uuid",
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "completed", // optional
  "priority": "high", // optional
  "due_date": "2024-01-01T00:00:00.000Z" // optional
}
```

#### Delete Task
```
POST /mcp/tasks/delete
Body:
{
  "task_id": "uuid"
}
```

### Subtasks Tools

#### List Subtasks
```
POST /mcp/subtasks/list
Body:
{
  "task_id": "uuid", // required
  "page": 1,
  "limit": 10
}
```

#### Get Subtask
```
POST /mcp/subtasks/get
Body:
{
  "subtask_id": "uuid"
}
```

#### Create Subtask
```
POST /mcp/subtasks/create
Body:
{
  "task_id": "uuid",
  "name": "Subtask Name",
  "description": "Description (optional)",
  "completed": false // optional, default: false
}
```

#### Update Subtask
```
POST /mcp/subtasks/update
Body:
{
  "subtask_id": "uuid",
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "completed": true // optional
}
```

#### Delete Subtask
```
POST /mcp/subtasks/delete
Body:
{
  "subtask_id": "uuid"
}
```

## Tools List Endpoint

Get a list of all available MCP tools:

```
GET /mcp/tools

Response:
{
  "tools": [
    {
      "name": "projects/list",
      "description": "List all projects",
      "inputSchema": { ... }
    },
    ...
  ]
}
```

## Response Format

All MCP tools return a consistent response format:

### Success Response
```json
{
  "tool": "tool_name",
  "success": true,
  "result": { ... }
}
```

### Error Response
```json
{
  "tool": "tool_name",
  "success": false,
  "error": "Error type",
  "message": "Error message",
  "status": 400
}
```

## Architecture

MCP tools **do not directly access the database**. Instead, they:
1. Receive requests from AI applications
2. Call the internal REST API endpoints (`/api/*`)
3. Return the results in MCP format

This ensures:
- ✅ Single source of truth (REST API)
- ✅ Consistent validation and error handling
- ✅ Reusable business logic
- ✅ Easy to maintain and test

## Example Usage

### List Projects
```bash
curl -X POST http://localhost:3001/mcp/projects/list \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "limit": 10
  }'
```

### Create Project
```bash
curl -X POST http://localhost:3001/mcp/projects/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "status": "active"
  }'
```

### Get Project with All Data
```bash
curl -X POST http://localhost:3001/mcp/projects/get \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid"
  }'
```

## Integration with AI Applications

MCP tools are designed to be used by AI applications that need to:
- Read data from Supabase
- Write data to Supabase
- Perform CRUD operations
- Access nested data (projects → roadmaps → tasks → subtasks)

All tools automatically:
- Authenticate requests
- Validate inputs
- Call the REST API
- Return formatted results
- Handle errors gracefully

## Notes

- All tools require authentication
- All tools call the REST API endpoints internally
- Tools return data in a consistent format
- Error handling is consistent across all tools
- Tools list endpoint provides schema information for AI integration



