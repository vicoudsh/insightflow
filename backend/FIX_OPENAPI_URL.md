# Fix OpenAPI URL Configuration

The OpenAPI JSON is showing `http://localhost:10000` instead of your production URL. Here's how to fix it:

## Problem

The OpenAPI schema is using a default localhost URL instead of reading from the environment variable.

## Solution

### 1. Set Environment Variable

In your `.env` file (in the `backend/` directory), add:

```env
API_BASE_URL=https://insightflow-h2mw.onrender.com
```

**Important:** 
- Do NOT include a trailing slash
- Use `https://` (not `http://`)
- Remove the port number (Render.com handles this automatically)

### 2. Alternative: Use SERVER_URL

If you prefer, you can use:

```env
SERVER_URL=https://insightflow-h2mw.onrender.com
```

### 3. Priority Order

The server will check in this order:
1. `API_BASE_URL` (preferred)
2. `SERVER_URL` (alternative)
3. `http://localhost:${PORT}` (default fallback)

### 4. Verify Configuration

After setting the environment variable and restarting the server:

```bash
# Check what URL is being used
curl https://insightflow-h2mw.onrender.com/.well-known/openapi.json | jq '.servers[0].url'

# Should output:
# "https://insightflow-h2mw.onrender.com"
```

### 5. For Render.com Deployment

In your Render.com environment variables, add:

```
API_BASE_URL=https://insightflow-h2mw.onrender.com
```

Make sure there's **no trailing slash**.

### 6. Debugging

The server now logs the base URL on startup and when serving the OpenAPI schema. Check your server logs for:

```
🌐 [getBaseUrl] Using API_BASE_URL: https://insightflow-h2mw.onrender.com
🌐 [OPENAPI] Final server URL in schema: https://insightflow-h2mw.onrender.com
```

If you see `localhost:10000`, it means the environment variable is not set or not being loaded correctly.

## Common Issues

### Issue 1: Port 10000 showing up
- **Cause:** The `PORT` environment variable is set to 10000
- **Solution:** Set `API_BASE_URL` explicitly to override the default

### Issue 2: Environment variable not loading
- **Cause:** `.env` file not in the correct location or not being loaded
- **Solution:** Make sure `.env` is in the `backend/` directory, and `dotenv.config()` is called before routes are set up

### Issue 3: Trailing slash causing issues
- **Cause:** URL has a trailing slash which might cause validation issues
- **Solution:** The code automatically removes trailing slashes, but make sure your `.env` doesn't have one

## Example .env File

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# API Base URL - used for OpenAPI schema
API_BASE_URL=https://insightflow-h2mw.onrender.com

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing Locally

For local development, you can override with:

```env
API_BASE_URL=http://localhost:3001
```

Or just remove `API_BASE_URL` to use the default `http://localhost:${PORT}`.

