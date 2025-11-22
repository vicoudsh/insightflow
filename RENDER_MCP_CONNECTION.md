# Connecting to MCP Server on Render

## MCP Server Endpoints

Once deployed on Render, your MCP server will be available at:

**Base URL**: `https://insightflow-h2mw.onrender.com` (or your Render URL)

### Available Endpoints

1. **Tools Discovery** (Public - No auth required):
   ```
   GET https://insightflow-h2mw.onrender.com/mcp/tools
   ```

2. **OpenAPI Schema** (Public):
   ```
   GET https://insightflow-h2mw.onrender.com/.well-known/openapi.json
   ```

3. **Plugin Manifest** (Public):
   ```
   GET https://insightflow-h2mw.onrender.com/.well-known/ai-plugin.json
   ```

4. **MCP Tools** (No user auth - backend uses service role):
   ```
   POST https://insightflow-h2mw.onrender.com/mcp/projects/list
   POST https://insightflow-h2mw.onrender.com/mcp/projects/get
   POST https://insightflow-h2mw.onrender.com/mcp/projects/create
   POST https://insightflow-h2mw.onrender.com/mcp/projects/update
   POST https://insightflow-h2mw.onrender.com/mcp/projects/delete
   # ... and similar for stacks, roadmaps, tasks, subtasks
   ```

## Testing the Connection

### 1. Test Tools Discovery

```bash
curl https://insightflow-h2mw.onrender.com/mcp/tools
```

Should return a list of available tools.

### 2. Test OpenAPI Schema

```bash
curl https://insightflow-h2mw.onrender.com/.well-known/openapi.json
```

Should return the OpenAPI 3.1.0 schema.

### 3. Test Plugin Manifest

```bash
curl https://insightflow-h2mw.onrender.com/.well-known/ai-plugin.json
```

Should return the OpenAI plugin manifest.

### 4. Test MCP Tool Execution

```bash
# List projects
curl -X POST https://insightflow-h2mw.onrender.com/mcp/projects/list \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10}'
```

## Connecting from MCP Client

If you're using an MCP client (like Claude Desktop, or custom MCP client), configure it to connect to:

```json
{
  "mcpServers": {
    "insightflow": {
      "url": "https://insightflow-h2mw.onrender.com/mcp",
      "transport": "http"
    }
  }
}
```

## For OpenAI/ChatGPT Plugin

If using as an OpenAI plugin:

1. **Plugin Manifest URL**:
   ```
   https://insightflow-h2mw.onrender.com/.well-known/ai-plugin.json
   ```

2. **OpenAPI Schema URL**:
   ```
   https://insightflow-h2mw.onrender.com/.well-known/openapi.json
   ```

3. **Authentication**: None required (backend handles authentication internally)

## Environment Variables on Render

Make sure these are set on Render:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for backend auth)
- `API_BASE_URL` - Your Render URL (e.g., `https://insightflow-h2mw.onrender.com`)
- `NODE_ENV` - `production`
- `PORT` - `3001`

## Troubleshooting

### 502 Bad Gateway
- Service may be starting up - wait a few minutes
- Check Render logs for errors
- Verify all environment variables are set

### 401 Unauthorized
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check server logs for authentication errors

### 404 Not Found
- Verify the URL is correct
- Check that the service is deployed and running
- Verify the route exists in your code

### Connection Timeout
- Render services may spin down after inactivity
- First request may take time to wake up the service
- Consider upgrading to a paid plan for always-on service

## Health Check

Test if your service is running:

```bash
curl https://insightflow-h2mw.onrender.com/health
```

Should return: `{"status": "ok"}`

