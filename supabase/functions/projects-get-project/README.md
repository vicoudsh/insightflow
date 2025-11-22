# Get Project Function

Retrieves a project with all related data: stacks, roadmaps, tasks, and subtasks.

## Request

**Method:** `POST`  
**URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-get-project`

**Headers:**
```
Authorization: Bearer <user_access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "projectId": "project_uuid"
}
```

## Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "uuid",
      "name": "My Project",
      "description": "Project description",
      "status": "active",
      "user_id": "user_uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "stacks": [
      {
        "id": "uuid",
        "project_id": "project_uuid",
        "name": "Stack Name",
        "technology": "React",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "roadmaps": [
      {
        "id": "uuid",
        "project_id": "project_uuid",
        "name": "Roadmap Name",
        "description": "Roadmap description",
        "created_at": "2024-01-01T00:00:00.000Z",
        "tasks": [
          {
            "id": "uuid",
            "roadmap_id": "roadmap_uuid",
            "name": "Task Name",
            "status": "pending",
            "created_at": "2024-01-01T00:00:00.000Z",
            "subtasks": [
              {
                "id": "uuid",
                "task_id": "task_uuid",
                "name": "Subtask Name",
                "completed": false,
                "created_at": "2024-01-01T00:00:00.000Z"
              }
            ]
          }
        ]
      }
    ]
  },
  "message": "Project retrieved successfully"
}
```

**Error (400):**
```json
{
  "error": "Project ID is required"
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

**Error (404):**
```json
{
  "error": "Project not found or access denied"
}
```

## Usage

```bash
# Deploy
./deploy.sh projects-get-project

# Test
./test-cloud.sh projects-get-project
```

## Frontend Usage

The response is already stringified (JSON), so you can use it directly:

```typescript
const response = await fetch(
  'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-get-project',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId: 'your-project-id' }),
  }
)

const result = await response.json()

if (result.success) {
  const { project, stacks, roadmaps } = result.data
  // Use the data in your frontend
}
```

## Database Tables Required

This function requires the following tables:
- `projects` - Main projects table
- `stacks` - Technology stacks for projects
- `roadmaps` - Project roadmaps
- `tasks` - Tasks within roadmaps
- `subtasks` - Subtasks within tasks

Make sure these tables exist and have proper relationships configured.

