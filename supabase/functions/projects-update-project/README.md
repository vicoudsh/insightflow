# Update Project Function

Updates an existing project. Only the project owner can update their projects.

## Request

**Method:** `POST`  
**URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-update-project`

**Headers:**
```
Authorization: Bearer <user_access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "id": "project_uuid",
  "name": "Updated Project Name", // optional
  "description": "Updated description", // optional
  "status": "completed" // optional
}
```

## Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "completed",
    "user_id": "user_uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T01:00:00.000Z"
  },
  "message": "Project updated successfully"
}
```

**Error (400):**
```json
{
  "error": "Project ID is required"
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
./deploy.sh projects-update-project

# Test
./test-cloud.sh projects-update-project
```

