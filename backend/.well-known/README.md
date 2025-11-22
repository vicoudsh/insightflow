# OpenAI Plugin Configuration

This directory contains the configuration files for the OpenAI plugin integration with the InsightFlow MCP Server.

## Files

- `ai-plugin.json` - OpenAI plugin manifest file
- `openapi.yaml` - OpenAPI specification for the MCP server API

## Endpoints

The plugin files are served at:
- `/.well-known/ai-plugin.json` - Plugin manifest
- `/.well-known/openapi.yaml` - OpenAPI specification

## Authentication

The plugin uses Bearer token authentication. Users need to:
1. Login to Supabase Auth
2. Get their authentication token
3. Include the token in the `Authorization` header as `Bearer <token>`

## Usage

### For Local Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. The plugin manifest will be available at:
   ```
   http://localhost:3001/.well-known/ai-plugin.json
   ```

3. The OpenAPI specification will be available at:
   ```
   http://localhost:3001/.well-known/openapi.yaml
   ```

### For Production

1. Update the `ai-plugin.json` file:
   - Change `url` in the `api` section to your production domain
   - Update `contact_email` if needed
   - Update `legal_info_url` if needed

2. Update the `openapi.yaml` file:
   - Change the `servers` section to include your production URL
   - Update the server URL from `http://localhost:3001` to your production domain

3. Ensure HTTPS is enabled (required for OpenAI plugins)

4. Deploy your backend server

## OpenAI Plugin Integration

To use this plugin with OpenAI:

1. Install the plugin in your OpenAI account
2. Provide the plugin URL: `https://your-domain.com/.well-known/ai-plugin.json`
3. Configure authentication with your Supabase token
4. The plugin will be available for use in ChatGPT

## Available Tools

The plugin provides the following MCP tools:

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
- `roadmaps/list` - List roadmaps
- `roadmaps/get` - Get a single roadmap
- `roadmaps/create` - Create a new roadmap
- `roadmaps/update` - Update a roadmap
- `roadmaps/delete` - Delete a roadmap

### Tasks
- `tasks/list` - List tasks
- `tasks/get` - Get a single task
- `tasks/create` - Create a new task
- `tasks/update` - Update a task
- `tasks/delete` - Delete a task

### Subtasks
- `subtasks/list` - List subtasks
- `subtasks/get` - Get a single subtask
- `subtasks/create` - Create a new subtask
- `subtasks/update` - Update a subtask
- `subtasks/delete` - Delete a subtask

## Testing

You can test the plugin endpoints:

```bash
# Get plugin manifest
curl http://localhost:3001/.well-known/ai-plugin.json

# Get OpenAPI specification
curl http://localhost:3001/.well-known/openapi.yaml

# Get available tools (public endpoint)
curl http://localhost:3001/mcp/tools
```

## Notes

- The plugin requires HTTPS in production (OpenAI requirement)
- All MCP endpoints require authentication except `/mcp/tools`
- The plugin uses Bearer token authentication
- CORS is configured to allow requests from the frontend origin



