# MCP Client Configuration for InsightFlow

## Connection Details

Your InsightFlow MCP server is hosted on Render at:

**Base URL**: `https://insightflow-h2mw.onrender.com`

## For MCP-Compatible Clients

### Claude Desktop MCP Configuration

Add to your Claude Desktop MCP configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac, or similar path on other platforms):

```json
{
  "mcpServers": {
    "insightflow": {
      "url": "https://insightflow-h2mw.onrender.com",
      "transport": "http",
      "basePath": "/mcp"
    }
  }
}
```

### Generic MCP Client Configuration

```json
{
  "server": {
    "name": "insightflow",
    "url": "https://insightflow-h2mw.onrender.com",
    "endpoints": {
      "tools": "/mcp/tools",
      "execute": "/mcp"
    },
    "authentication": {
      "type": "none"
    }
  }
}
```

## Available Endpoints

### 1. Tools Discovery
```
GET https://insightflow-h2mw.onrender.com/mcp/tools
```

Returns list of available MCP tools.

### 2. Execute Tool
```
POST https://insightflow-h2mw.onrender.com/mcp/{tool_path}
Content-Type: application/json

{
  "tool": "projects/list",
  "arguments": {
    "page": 1,
    "limit": 10
  }
}
```

### 3. OpenAPI Schema
```
GET https://insightflow-h2mw.onrender.com/.well-known/openapi.json
```

Full OpenAPI 3.1.0 specification.

## Available Tools

### Projects
- `projects/list` - List all projects
- `projects/get` - Get a single project
- `projects/create` - Create a new project
- `projects/update` - Update a project
- `projects/delete` - Delete a project

### Stacks
- `stacks/list` - List stacks
- `stacks/get` - Get a single stack
- `stacks/create` - Create a new stack
- `stacks/update` - Update a stack
- `stacks/delete` - Delete a stack

### Roadmaps
- `roadmaps/list` - List roadmaps for a project
- `roadmaps/get` - Get a single roadmap
- `roadmaps/create` - Create a new roadmap
- `roadmaps/update` - Update a roadmap
- `roadmaps/delete` - Delete a roadmap

### Tasks
- `tasks/list` - List tasks for a roadmap
- `tasks/get` - Get a single task
- `tasks/create` - Create a new task
- `tasks/update` - Update a task
- `tasks/delete` - Delete a task

### Subtasks
- `subtasks/list` - List subtasks for a task
- `subtasks/get` - Get a single subtask
- `subtasks/create` - Create a new subtask
- `subtasks/update` - Update a subtask
- `subtasks/delete` - Delete a subtask

## Testing Connection

Use the test script:

```bash
cd backend
./test-mcp-connection.sh
```

Or test manually:

```bash
# Test health
curl https://insightflow-h2mw.onrender.com/health

# Test tools
curl https://insightflow-h2mw.onrender.com/mcp/tools

# Test OpenAPI
curl https://insightflow-h2mw.onrender.com/.well-known/openapi.json
```

## Authentication

**No authentication required** - The backend server uses service role authentication internally. You don't need to provide tokens when calling MCP tools.

## Troubleshooting

### Service Not Responding
- Render free tier services spin down after inactivity
- First request may take 30-60 seconds to wake up
- Consider upgrading to paid plan for always-on service

### Connection Errors
- Verify the URL is correct
- Check Render dashboard for service status
- Review Render logs for errors

### Tool Execution Fails
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set on Render
- Check server logs for authentication errors
- Ensure Supabase connection is working

