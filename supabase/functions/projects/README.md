# Projects Management Functions

Four edge functions for managing projects: create, get, update, and delete.

## Functions

1. **projects-create-project** - Create a new project
2. **projects-get-project** - Get a project with all related data (stacks, roadmaps, tasks, subtasks)
3. **projects-update-project** - Update an existing project
4. **projects-delete-project** - Delete a project

## Prerequisites

### Database Table

These functions require a `projects` table with the following structure:

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

## Function URLs

All functions are deployed and available at:

- **Create:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-create-project`
- **Get:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-get-project`
- **Update:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-update-project`
- **Delete:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-delete-project`

## Authentication

All functions require:
- **Authorization header** with a valid user access token
- The user must be authenticated via Supabase Auth

## Quick Start

### 1. Create Project

```bash
curl -X POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-create-project' \
  --header "Authorization: Bearer USER_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "My New Project",
    "description": "Project description",
    "status": "active"
  }'
```

### 2. Get Project

```bash
curl -X POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-get-project' \
  --header "Authorization: Bearer USER_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "projectId": "project-uuid"
  }'
```

**Response includes:**
- Project details
- All stacks for the project
- All roadmaps with tasks and subtasks

### 3. Update Project

```bash
curl -X POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-update-project' \
  --header "Authorization: Bearer USER_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "id": "project-uuid",
    "name": "Updated Project Name",
    "status": "completed"
  }'
```

### 4. Delete Project

```bash
curl -X POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/projects-delete-project' \
  --header "Authorization: Bearer USER_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "id": "project-uuid"
  }'
```

## Deployment Status

✅ All functions deployed successfully to cloud

## Individual Function Documentation

- [Create Project](./projects-create-project/README.md)
- [Get Project](./projects-get-project/README.md)
- [Update Project](./projects-update-project/README.md)
- [Delete Project](./projects-delete-project/README.md)

