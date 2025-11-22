# OpenAPI JSON Schema for Backend MCP Server

The OpenAPI schema is now available in **JSON format** for the backend Express server.

## Available Endpoints

### JSON Format (Preferred)
```
GET http://localhost:3001/.well-known/openapi.json
GET http://localhost:3001/openapi.json
```

### YAML Format (Also Available)
```
GET http://localhost:3001/.well-known/openapi.yaml
```

## Public Access

These endpoints are **publicly accessible** - no authentication required. They're served before any authentication middleware is applied.

## Usage

### For OpenAI Plugin

Update `ai-plugin.json` to point to the JSON schema:

```json
{
  "api": {
    "type": "openapi",
    "url": "http://localhost:3001/.well-known/openapi.json",
    "is_user_authenticated": true
  }
}
```

### For Production

Update the server URL in `openapi.json`:

```json
{
  "servers": [
    {
      "url": "https://your-production-domain.com",
      "description": "Production server"
    }
  ]
}
```

And update `ai-plugin.json`:

```json
{
  "api": {
    "type": "openapi",
    "url": "https://your-production-domain.com/.well-known/openapi.json",
    "is_user_authenticated": true
  }
}
```

## Format Details

- **Version:** OpenAPI 3.1.0
- **Format:** JSON (preferred) or YAML
- **Content-Type:** `application/json` for JSON, `text/yaml` for YAML
- **Authentication:** None required (public endpoint)

## Endpoints Documented

The schema documents all MCP tool endpoints:
- Projects (list, get, create, update, delete)
- Stacks (list, get, create, update, delete)
- Roadmaps (list, get, create, update, delete)
- Tasks (list, get, create, update, delete)
- Subtasks (list, get, create, update, delete)

Plus the `/mcp/tools` endpoint for discovering available tools.

