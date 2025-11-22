# Delete Project Function

Deletes an existing project. Only the project owner can delete their projects.

## Request

**Method:** `POST`  
**URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects/delete_project`

**Headers:**
```
Authorization: Bearer <user_access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "id": "project_uuid"
}
```

## Response

**Success (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "deleted_id": "project_uuid"
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
./deploy.sh projects/delete_project

# Test
./test-cloud.sh projects/delete_project
```

