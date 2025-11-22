# Environment Configuration

## Server URL Configuration

The backend server URL can be configured via environment variables for the OpenAPI schema and plugin manifest.

### Environment Variables

Add to your `.env` file:

```env
# Server URL - used for OpenAPI schema and plugin manifest
# For local development:
API_BASE_URL=http://localhost:3001

# For production (e.g., Render.com):
API_BASE_URL=https://insightflow-h2mw.onrender.com
```

Or alternatively use `SERVER_URL`:

```env
SERVER_URL=https://insightflow-h2mw.onrender.com
```

### Priority Order

The server URL is determined in this order:
1. `API_BASE_URL` (preferred)
2. `SERVER_URL` (alternative)
3. `http://localhost:${PORT}` (default fallback)

### Example .env for Local Development

```env
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=http://localhost:3000
```

### Example .env for Production (Render.com)

```env
PORT=3001
NODE_ENV=production
API_BASE_URL=https://insightflow-h2mw.onrender.com

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## Dynamic URLs

When you set `API_BASE_URL` or `SERVER_URL`, the following endpoints will automatically use this URL:

- `/.well-known/ai-plugin.json` - Plugin manifest (will point to correct OpenAPI URL)
- `/.well-known/openapi.json` - OpenAPI schema (server URL will be updated)
- `/.well-known/openapi.yaml` - OpenAPI schema YAML (server URL will be updated)
- `/openapi.json` - Alternative OpenAPI JSON endpoint

## Testing

After setting the environment variable, restart your server and check:

```bash
# Check plugin manifest
curl http://localhost:3001/.well-known/ai-plugin.json | jq '.api.url'

# Check OpenAPI schema
curl http://localhost:3001/.well-known/openapi.json | jq '.servers[0].url'
```

Both should reflect the URL from your `API_BASE_URL` or `SERVER_URL` environment variable.

