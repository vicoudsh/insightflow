# API Server Quick Start

## ✅ Server Status

The API server is **running locally** on `http://localhost:3001`

## Quick Commands

### Start Server

```bash
cd api
npm run dev
```

### Stop Server

Press `Ctrl+C` in the terminal where the server is running.

### Check Server Status

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/
```

## Testing Endpoints

All API endpoints require authentication. You need a valid user access token from Supabase Auth.

### Get User Token

1. Sign up/login via Supabase Auth in your frontend
2. Get the access token from the auth response
3. Use it in the `Authorization` header

### Example Request

```bash
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Create a Project

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "status": "active"
  }'
```

## Available Endpoints

- **Projects:** `GET|POST|PUT|DELETE /api/projects`
- **Stacks:** `GET|POST|PUT|DELETE /api/stacks`
- **Roadmaps:** `GET|POST|PUT|DELETE /api/roadmaps`
- **Tasks:** `GET|POST|PUT|DELETE /api/tasks`
- **Subtasks:** `GET|POST|PUT|DELETE /api/subtasks`

## Environment Variables

The server uses environment variables from `api/.env`:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)

## Server Logs

The server logs requests using Morgan. Check the console for:
- Request logs
- Error messages
- Server status

## Troubleshooting

### Server won't start
- Check if port 3001 is available
- Verify `.env` file exists and has correct values
- Check Node.js version (requires >= 18.0.0)

### 401 Unauthorized
- Verify you're sending a valid Bearer token
- Check token hasn't expired
- Ensure token is from Supabase Auth

### 404 Not Found
- Check the endpoint URL is correct
- Verify the resource exists in the database
- Check RLS policies allow access

### 500 Internal Server Error
- Check server logs for error details
- Verify database connection
- Check Supabase credentials

## Next Steps

1. Test endpoints with a valid auth token
2. Integrate with your frontend
3. Deploy to production

For complete API documentation, see `API_DOCUMENTATION.md`

