# InsightFlow Backend

Production-ready Node.js backend for InsightFlow, built with Express.js and Supabase.

## Routes

The backend exposes two sets of routes:

1. **REST API** (`/api/*`) - For frontend applications
2. **MCP Tools** (`/mcp/*`) - For AI applications (Model Context Protocol)

Both routes use the same underlying REST API endpoints, ensuring consistency and single source of truth.

## Features

### REST API (`/api/*`)
- ✅ **CRUD endpoints** for all tables (projects, stacks, roadmaps, tasks, subtasks)
- ✅ **Authentication** using Supabase Auth
- ✅ **Authorization** - users can only access their own data
- ✅ **Validation** using Zod schemas
- ✅ **Error handling** with proper error responses
- ✅ **Pagination** support for list endpoints
- ✅ **Type-safe** with validation schemas

### MCP Tools (`/mcp/*`)
- ✅ **AI-friendly interface** for Model Context Protocol
- ✅ **Calls REST API endpoints** internally (not DB directly)
- ✅ **Consistent response format** for AI applications
- ✅ **Tools list endpoint** with schema information
- ✅ **Same authentication** as REST API
- ✅ **Same validation** and error handling

### Security & Performance
- ✅ **Rate limiting** to prevent abuse
- ✅ **CORS** support for frontend integration
- ✅ **Security headers** using Helmet
- ✅ **Logging** with Morgan
- ✅ **Error handling** with proper error responses

## Table Support

The API provides full CRUD operations for:
- ✅ **Projects** - `/api/projects`
- ✅ **Stacks** - `/api/stacks`
- ✅ **Roadmaps** - `/api/roadmaps`
- ✅ **Tasks** - `/api/tasks`
- ✅ **Subtasks** - `/api/subtasks`

**Note:** `embedding_messages` table is excluded as requested.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Supabase project with tables created
- Supabase API keys

## Installation

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file:**
   ```env
   PORT=3001
   NODE_ENV=production
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CORS_ORIGIN=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## REST API Endpoints (`/api/*`)

These endpoints are for frontend applications.

### Projects

- `GET /api/projects` - Get all projects (paginated)
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Stacks

- `GET /api/stacks` - Get all stacks (optionally filtered by `project_id`)
- `GET /api/stacks/:id` - Get a single stack
- `POST /api/stacks` - Create a new stack
- `PUT /api/stacks/:id` - Update a stack
- `DELETE /api/stacks/:id` - Delete a stack

### Roadmaps

- `GET /api/roadmaps?project_id=:id` - Get all roadmaps for a project
- `GET /api/roadmaps/:id` - Get a single roadmap with tasks and subtasks
- `POST /api/roadmaps` - Create a new roadmap
- `PUT /api/roadmaps/:id` - Update a roadmap
- `DELETE /api/roadmaps/:id` - Delete a roadmap

### Tasks

- `GET /api/tasks?roadmap_id=:id` - Get all tasks for a roadmap
- `GET /api/tasks/:id` - Get a single task with subtasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Subtasks

- `GET /api/subtasks?task_id=:id` - Get all subtasks for a task
- `GET /api/subtasks/:id` - Get a single subtask
- `POST /api/subtasks` - Create a new subtask
- `PUT /api/subtasks/:id` - Update a subtask
- `DELETE /api/subtasks/:id` - Delete a subtask

## Routes Overview

### REST API Routes (`/api/*`)
For frontend applications - standard REST API with GET, POST, PUT, DELETE methods.

### MCP Tools Routes (`/mcp/*`)
For AI applications - POST-only endpoints that call REST API internally.

## Authentication

All endpoints (both `/api/*` and `/mcp/*`) require authentication via Bearer token:

```
Authorization: Bearer <user_access_token>
```

Get the access token from Supabase Auth after user login.

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error message",
  "details": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Example Usage

### Create a Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "status": "active"
  }'
```

### Get All Projects
```bash
curl -X GET http://localhost:3001/api/projects?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Project
```bash
curl -X PUT http://localhost:3001/api/projects/:id \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "status": "completed"
  }'
```

### Delete a Project
```bash
curl -X DELETE http://localhost:3001/api/projects/:id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Validation

All requests are validated using Zod schemas. Invalid requests will return a 400 status with validation errors:

```json
{
  "error": "Validation error",
  "message": "Invalid request data",
  "details": [
    {
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

## Error Handling

The API handles various error scenarios:

- **400 Bad Request** - Validation errors, invalid input
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User doesn't have access to the resource
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server errors

## Security

- **Helmet** - Security headers
- **CORS** - Configurable CORS policy
- **Rate Limiting** - Prevents abuse
- **Authentication** - All endpoints require auth
- **Authorization** - Users can only access their own data
- **Input Validation** - All inputs are validated

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure environment variables
3. Start the server: `npm start`
4. Use a process manager like PM2 for production

## MCP Tools

See `MCP_DOCUMENTATION.md` for complete MCP tools documentation.

### Quick MCP Example

```bash
# List tools
curl http://localhost:3001/mcp/tools \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a project via MCP
curl -X POST http://localhost:3001/mcp/projects/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js              # Supabase client configuration
│   ├── controllers/
│   │   ├── projectsController.js    # REST API controllers
│   │   ├── stacksController.js
│   │   ├── roadmapsController.js
│   │   ├── tasksController.js
│   │   ├── subtasksController.js
│   │   └── mcp/                     # MCP controllers
│   │       ├── projectsMCPController.js
│   │       ├── stacksMCPController.js
│   │       ├── roadmapsMCPController.js
│   │       ├── tasksMCPController.js
│   │       └── subtasksMCPController.js
│   ├── middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   └── errorHandler.js          # Error handling middleware
│   ├── routes/
│   │   ├── projects.js              # REST API routes
│   │   ├── stacks.js
│   │   ├── roadmaps.js
│   │   ├── tasks.js
│   │   ├── subtasks.js
│   │   └── mcp/                     # MCP routes
│   │       └── index.js
│   ├── utils/
│   │   ├── validation.js            # Validation schemas
│   │   └── mcp/                     # MCP utilities
│   │       └── apiClient.js         # Internal API client
│   ├── app.js                       # Express app configuration
│   └── server.js                    # Server entry point
├── .env.example
├── package.json
├── README.md
└── MCP_DOCUMENTATION.md
```

## License

MIT

