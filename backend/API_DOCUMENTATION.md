# InsightFlow API Documentation

Production-ready Node.js REST API with full CRUD operations for all Supabase tables.

## Base URL

```
http://localhost:3001/api
```

## Authentication

All endpoints require authentication via Bearer token:

```
Authorization: Bearer <user_access_token>
```

Get the access token from Supabase Auth after user login.

## Endpoints

### Projects

#### Get All Projects
```
GET /api/projects
Query Parameters:
  - page (optional, default: 1)
  - limit (optional, default: 10, max: 100)
  - sortBy (optional, default: 'created_at')
  - sortOrder (optional, default: 'desc', values: 'asc' | 'desc')

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Get Single Project
```
GET /api/projects/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Create Project
```
POST /api/projects
Body:
{
  "name": "Project Name",
  "description": "Description (optional)",
  "status": "active" // optional: 'active' | 'completed' | 'archived'
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Project created successfully"
}
```

#### Update Project
```
PUT /api/projects/:id
Body:
{
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "completed" // optional
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Project updated successfully"
}
```

#### Delete Project
```
DELETE /api/projects/:id

Response:
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Stacks

#### Get All Stacks
```
GET /api/stacks
Query Parameters:
  - project_id (optional, filter by project)
  - page (optional, default: 1)
  - limit (optional, default: 10)

Response:
{
  "success": true,
  "data": [...],
  "pagination": { ... }
}
```

#### Get Single Stack
```
GET /api/stacks/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Create Stack
```
POST /api/stacks
Body:
{
  "project_id": "uuid",
  "name": "Stack Name",
  "technology": "Technology (optional)",
  "description": "Description (optional)"
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Stack created successfully"
}
```

#### Update Stack
```
PUT /api/stacks/:id
Body:
{
  "name": "Updated Name", // optional
  "technology": "Updated Technology", // optional
  "description": "Updated Description" // optional
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Stack updated successfully"
}
```

#### Delete Stack
```
DELETE /api/stacks/:id

Response:
{
  "success": true,
  "message": "Stack deleted successfully"
}
```

### Roadmaps

#### Get All Roadmaps
```
GET /api/roadmaps?project_id=:id
Query Parameters:
  - project_id (required)
  - page (optional, default: 1)
  - limit (optional, default: 10)

Response:
{
  "success": true,
  "data": [...],
  "pagination": { ... }
}
```

#### Get Single Roadmap (with tasks and subtasks)
```
GET /api/roadmaps/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Roadmap Name",
    "tasks": [
      {
        "id": "uuid",
        "name": "Task Name",
        "subtasks": [...]
      }
    ]
  }
}
```

#### Create Roadmap
```
POST /api/roadmaps
Body:
{
  "project_id": "uuid",
  "name": "Roadmap Name",
  "description": "Description (optional)",
  "status": "draft" // optional: 'draft' | 'active' | 'completed'
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Roadmap created successfully"
}
```

#### Update Roadmap
```
PUT /api/roadmaps/:id
Body:
{
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "active" // optional
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Roadmap updated successfully"
}
```

#### Delete Roadmap
```
DELETE /api/roadmaps/:id

Response:
{
  "success": true,
  "message": "Roadmap deleted successfully"
}
```

### Tasks

#### Get All Tasks
```
GET /api/tasks?roadmap_id=:id
Query Parameters:
  - roadmap_id (required)
  - page (optional, default: 1)
  - limit (optional, default: 10)

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Task Name",
      "subtasks": [...]
    }
  ],
  "pagination": { ... }
}
```

#### Get Single Task (with subtasks)
```
GET /api/tasks/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Task Name",
    "subtasks": [...]
  }
}
```

#### Create Task
```
POST /api/tasks
Body:
{
  "roadmap_id": "uuid",
  "name": "Task Name",
  "description": "Description (optional)",
  "status": "pending", // optional: 'pending' | 'in_progress' | 'completed' | 'blocked'
  "priority": "medium", // optional: 'low' | 'medium' | 'high'
  "due_date": "2024-01-01T00:00:00.000Z" // optional, ISO datetime
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Task created successfully"
}
```

#### Update Task
```
PUT /api/tasks/:id
Body:
{
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "status": "completed", // optional
  "priority": "high", // optional
  "due_date": "2024-01-01T00:00:00.000Z" // optional
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Task updated successfully"
}
```

#### Delete Task
```
DELETE /api/tasks/:id

Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Subtasks

#### Get All Subtasks
```
GET /api/subtasks?task_id=:id
Query Parameters:
  - task_id (required)
  - page (optional, default: 1)
  - limit (optional, default: 10)

Response:
{
  "success": true,
  "data": [...],
  "pagination": { ... }
}
```

#### Get Single Subtask
```
GET /api/subtasks/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Create Subtask
```
POST /api/subtasks
Body:
{
  "task_id": "uuid",
  "name": "Subtask Name",
  "description": "Description (optional)",
  "completed": false // optional, default: false
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Subtask created successfully"
}
```

#### Update Subtask
```
PUT /api/subtasks/:id
Body:
{
  "name": "Updated Name", // optional
  "description": "Updated Description", // optional
  "completed": true // optional
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Subtask updated successfully"
}
```

#### Delete Subtask
```
DELETE /api/subtasks/:id

Response:
{
  "success": true,
  "message": "Subtask deleted successfully"
}
```

## Error Responses

### 400 Bad Request
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

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Rate Limiting

The API has rate limiting enabled:
- **Window:** 15 minutes (configurable)
- **Max Requests:** 100 per IP (configurable)

## Security Features

- ✅ Authentication required for all endpoints
- ✅ Row Level Security (RLS) enforced via Supabase
- ✅ Input validation using Zod schemas
- ✅ CORS protection
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Error handling

## Examples

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
curl -X GET "http://localhost:3001/api/projects?page=1&limit=10" \
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

## Notes

- All timestamps are in ISO 8601 format
- All UUIDs must be valid UUID v4 format
- Pagination is available for all list endpoints
- Sorting is available for projects endpoint
- RLS policies in Supabase ensure users can only access their own data

