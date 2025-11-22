# Starting the API Server

## Quick Start

```bash
cd api
npm install
npm run dev
```

The server will start on `http://localhost:3001`

## Environment Setup

The `.env` file is automatically created from the root `.env` file. Make sure it contains:

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://yoxuhgzmxmrzxzrxrlky.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
CORS_ORIGIN=http://localhost:3000
```

## Verify Server is Running

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/

# Test endpoint (requires auth)
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## Server Status

✅ Server is running on port 3001
✅ Health check endpoint: http://localhost:3001/health
✅ API endpoints: http://localhost:3001/api/*

## Testing Endpoints

All endpoints require authentication. Get a user token from Supabase Auth first.

Example:
```bash
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

For complete API documentation, see `API_DOCUMENTATION.md`

