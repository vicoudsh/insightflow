# MCP Handler Edge Function

This Supabase Edge Function handles all Model Context Protocol (MCP) tool actions for InsightFlow. It provides a unified interface for AI applications to interact with the InsightFlow project management system.

## Features

- ✅ **Single endpoint** for all MCP tools
- ✅ **Tool discovery** via `/tools` endpoint (public)
- ✅ **Authentication** via Bearer token (Supabase Auth)
- ✅ **Row Level Security (RLS)** automatically enforced
- ✅ **All CRUD operations** for projects, stacks, roadmaps, tasks, and subtasks
- ✅ **Pagination support** for list endpoints
- ✅ **Relational queries** (e.g., roadmaps with tasks and subtasks)

## Endpoints

### Tools Discovery (Public)

```
GET /functions/v1/mcp-handler/tools
```

Returns a list of all available MCP tools with their input schemas. No authentication required.

**Response:**
```json
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

### Execute MCP Tool (Requires Auth)

```
POST /functions/v1/mcp-handler
```

Execute any MCP tool by providing the tool name in the request body.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tool": "projects/list",
  "page": 1,
  "limit": 10
}
```

**Response:**
```json
{
  "tool": "projects/list",
  "success": true,
  "result": {
    "data": [ ... ],
    "pagination": { ... }
  }
}
```

## Available Tools

### Projects

- `projects/list` - List all projects (paginated)
- `projects/get` - Get a single project by ID
- `projects/create` - Create a new project
- `projects/update` - Update an existing project
- `projects/delete` - Delete a project

### Stacks

- `stacks/list` - List stacks (optionally filtered by `project_id`)
- `stacks/get` - Get a single stack by ID
- `stacks/create` - Create a new stack
- `stacks/update` - Update an existing stack
- `stacks/delete` - Delete a stack

### Roadmaps

- `roadmaps/list` - List roadmaps for a project (requires `project_id`)
- `roadmaps/get` - Get a single roadmap with tasks and subtasks
- `roadmaps/create` - Create a new roadmap
- `roadmaps/update` - Update an existing roadmap
- `roadmaps/delete` - Delete a roadmap

### Tasks

- `tasks/list` - List tasks for a roadmap (requires `roadmap_id`)
- `tasks/get` - Get a single task with subtasks
- `tasks/create` - Create a new task
- `tasks/update` - Update an existing task
- `tasks/delete` - Delete a task

### Subtasks

- `subtasks/list` - List subtasks for a task (requires `task_id`)
- `subtasks/get` - Get a single subtask
- `subtasks/create` - Create a new subtask
- `subtasks/update` - Update an existing subtask
- `subtasks/delete` - Delete a subtask

## Usage Examples

### List Projects

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list",
    "page": 1,
    "limit": 10
  }'
```

### Create Project

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/create",
    "name": "My New Project",
    "description": "Project description",
    "status": "active"
  }'
```

### Get Roadmap with Tasks

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "roadmaps/get",
    "roadmap_id": "uuid-here"
  }'
```

### List Tasks for Roadmap

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "tasks/list",
    "roadmap_id": "uuid-here",
    "page": 1,
    "limit": 20
  }'
```

## Authentication

All tool executions require a valid Supabase access token in the Authorization header:

```
Authorization: Bearer <supabase_access_token>
```

Get the access token from:
1. Supabase Auth client after user login
2. Supabase dashboard (temporary token for testing)

## Row Level Security (RLS)

The function uses Supabase's authenticated client, which automatically enforces Row Level Security policies:

- Users can only access **their own projects**
- Access to related resources (stacks, roadmaps, tasks, subtasks) is controlled through the ownership chain via `projects.user_id`
- All queries automatically filter by the authenticated user's ID

## Error Handling

The function returns structured error responses:

```json
{
  "tool": "projects/get",
  "success": false,
  "error": "Not Found",
  "message": "Resource not found or access denied"
}
```

Common error scenarios:
- **401 Unauthorized** - Missing or invalid token
- **400 Bad Request** - Missing required fields or invalid input
- **404 Not Found** - Resource doesn't exist or user doesn't have access
- **500 Internal Server Error** - Server error

## Deployment

### Deploy to Supabase

```bash
cd supabase
supabase functions deploy mcp-handler
```

### Test Locally

```bash
cd supabase
supabase functions serve mcp-handler --no-verify-jwt
```

### Environment Variables

The function automatically uses Supabase environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

These are automatically available in Edge Functions - no configuration needed!

## Integration with OpenAI

This function is compatible with OpenAI's function calling. To use it:

1. **Discover tools:**
   ```
   GET https://YOUR_PROJECT.supabase.co/functions/v1/mcp-handler/tools
   ```

2. **Use tool schemas** from the response to configure OpenAI function calling

3. **Execute tools** by calling the function with `tool` and parameters in the request body

## Differences from Express Backend

This Edge Function:
- ✅ Runs directly in Supabase (no separate server needed)
- ✅ Directly accesses Supabase database (no API client layer)
- ✅ Automatically handles RLS through authenticated client
- ✅ Single endpoint for all tools (simpler routing)
- ✅ Scales automatically with Supabase infrastructure

The Express backend MCP routes still work and can coexist with this Edge Function.

