# Dynamic URL Configuration

The backend server now supports dynamic URL configuration via environment variables.

## Environment Variables

Add to your `.env` file:

### For Local Development
```env
API_BASE_URL=http://localhost:3001
```

### For Production (Render.com)
```env
API_BASE_URL=https://insightflow-h2mw.onrender.com
```

Or use `SERVER_URL` as an alternative:
```env
SERVER_URL=https://insightflow-h2mw.onrender.com
```

## Priority Order

The server URL is determined in this order:
1. `API_BASE_URL` (preferred)
2. `SERVER_URL` (alternative)
3. `http://localhost:${PORT}` (default fallback)

## What Gets Updated Dynamically

When you set `API_BASE_URL` or `SERVER_URL`, these endpoints automatically use the configured URL:

- ✅ `/.well-known/ai-plugin.json` - Plugin manifest (API URL updated)
- ✅ `/.well-known/openapi.json` - OpenAPI JSON schema (server URL updated)
- ✅ `/.well-known/openapi.yaml` - OpenAPI YAML schema (server URL updated)
- ✅ `/openapi.json` - Alternative OpenAPI JSON endpoint (server URL updated)

## Testing

After setting the environment variable and restarting the server:

### Check Plugin Manifest
```bash
curl http://localhost:3001/.well-known/ai-plugin.json | jq '.api.url'
```

Should show: `https://insightflow-h2mw.onrender.com/.well-known/openapi.json` (if API_BASE_URL is set)

### Check OpenAPI Schema
```bash
curl http://localhost:3001/.well-known/openapi.json | jq '.servers[0].url'
```

Should show: `https://insightflow-h2mw.onrender.com` (if API_BASE_URL is set)

## Production Example

For your Render.com deployment, set in Render environment variables:

```env
API_BASE_URL=https://insightflow-h2mw.onrender.com
NODE_ENV=production
PORT=3001
# ... other environment variables
```

The OpenAPI schema will automatically use the production URL instead of localhost!

