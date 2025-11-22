# Create Project Function

Creates a new project in the database.

## Request

**Method:** `POST`  
**URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-create-project`

**Headers:**
```
Authorization: Bearer <user_access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "My Project",
  "description": "Project description (optional)",
  "status": "active" // optional, defaults to "active"
}
```

## Response

**Success (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Project",
    "description": "Project description",
    "status": "active",
    "user_id": "user_uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

**Error (400):**
```json
{
  "error": "Name is required and must be a non-empty string"
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

## Usage

```bash
# Deploy
./deploy.sh projects-create-project

# Test
./test-cloud.sh projects-create-project
```

