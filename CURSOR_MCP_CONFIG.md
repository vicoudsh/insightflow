# Cursor MCP Configuration for InsightFlow

## Configuration File Location

The Cursor MCP configuration file is located at:
```
~/.cursor/mcp.json
```

## Current Configuration

Your InsightFlow MCP server is configured to connect to:

**URL**: `https://insightflow-h2mw.onrender.com`  
**Base Path**: `/mcp`  
**Authentication**: None required (backend handles it internally)

## Configuration Format

```json
{
  "mcpServers": {
    "insightflow": {
      "url": "https://insightflow-h2mw.onrender.com",
      "basePath": "/mcp",
      "transport": "http"
    }
  }
}
```

## Available MCP Tools

Once connected, you'll have access to:

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

## Testing the Connection

### 1. Test Health Endpoint
```bash
curl https://insightflow-h2mw.onrender.com/health
```

Expected response: `{"status": "ok"}`

### 2. Test Tools Discovery
```bash
curl https://insightflow-h2mw.onrender.com/mcp/tools
```

Expected response: JSON with list of available tools

### 3. Test MCP Tool Execution
```bash
curl -X POST https://insightflow-h2mw.onrender.com/mcp/projects/list \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10}'
```

## Using MCP Tools in Cursor

Once configured, you can use the MCP tools in Cursor:

1. **List Projects**: Ask Cursor to "list my projects"
2. **Create Project**: Ask Cursor to "create a new project called X"
3. **Get Project**: Ask Cursor to "get project details for project Y"
4. **Update Project**: Ask Cursor to "update project Y with description Z"
5. **Delete Project**: Ask Cursor to "delete project Y"

The same applies to stacks, roadmaps, tasks, and subtasks.

## Troubleshooting

### Connection Failed
- Verify your Render service is deployed and running
- Check Render dashboard for service status
- Ensure all environment variables are set correctly

### Service Not Responding
- Render free tier services spin down after inactivity
- First request may take 30-60 seconds to wake up the service
- Check Render logs for errors

### Tools Not Available
- Verify the MCP server is accessible: `curl https://insightflow-h2mw.onrender.com/mcp/tools`
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set on Render
- Review server logs for authentication errors

### Restart Cursor
After updating the configuration file, you may need to:
1. Close Cursor completely
2. Reopen Cursor
3. The MCP server connection should be active

## Next Steps

1. **Restart Cursor** to load the new MCP configuration
2. **Test Connection** using the commands above
3. **Use MCP Tools** in your conversations with Cursor
4. **Monitor Render** dashboard for any deployment issues

