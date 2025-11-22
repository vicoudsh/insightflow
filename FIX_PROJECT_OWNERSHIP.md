# Fix Project Ownership for RLS

## Problem
Projects might be assigned to a different user than the one currently logged in, causing RLS to block access to roadmaps, stacks, tasks, and subtasks.

## Solution

### Step 1: Find Your User ID

1. Open your browser's developer console (F12)
2. Go to the Application/Storage tab
3. Look for `localStorage` and find the `auth_token`
4. Or check the network tab when making an API request - the user ID will be in the backend logs

Alternatively, run this SQL in Supabase SQL Editor:

```sql
-- Get all users and their IDs
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

### Step 2: Update Project Ownership

Run this SQL in Supabase SQL Editor, replacing `YOUR_USER_ID` with your actual user ID:

```sql
-- Update all projects to belong to your user
UPDATE projects
SET user_id = 'YOUR_USER_ID_HERE'
WHERE user_id IS NULL OR user_id != 'YOUR_USER_ID_HERE';

-- Verify the update
SELECT 
  id,
  name,
  user_id,
  created_at
FROM projects;
```

### Step 3: Alternative - Assign to Most Recent User

If you're the only user or the most recent user, run:

```sql
-- Assign all projects to the most recent user
UPDATE projects
SET user_id = (
  SELECT id FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1
);

-- Verify
SELECT 
  p.id,
  p.name,
  p.user_id,
  u.email as owner_email
FROM projects p
LEFT JOIN auth.users u ON u.id = p.user_id;
```

### Step 4: Verify RLS is Working

After updating project ownership, verify that:
1. Projects are visible in the frontend
2. Roadmaps are visible for projects
3. Stacks are visible for projects
4. Tasks and subtasks are visible

## Quick Fix Script

Run this in Supabase SQL Editor to automatically assign projects to the first/most recent user:

```sql
-- Quick fix: Assign all projects to the first user
DO $$
DECLARE
  first_user_id UUID;
  updated_count INTEGER;
BEGIN
  -- Get the first user (or most recent)
  SELECT id INTO first_user_id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    -- Update all projects
    UPDATE projects
    SET user_id = first_user_id
    WHERE user_id IS NULL OR user_id != first_user_id;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RAISE NOTICE 'Updated % projects to user: %', updated_count, first_user_id;
  ELSE
    RAISE NOTICE 'No users found!';
  END IF;
END $$;
```

## Check Current Status

Run this to see the current state:

```sql
-- Check project ownership
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.user_id,
  u.email as owner_email,
  CASE 
    WHEN p.user_id IS NULL THEN '❌ NO OWNER'
    ELSE '✅ HAS OWNER'
  END as status
FROM projects p
LEFT JOIN auth.users u ON u.id = p.user_id;

-- Count roadmaps per project
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.user_id,
  COUNT(r.id) as roadmap_count
FROM projects p
LEFT JOIN roadmaps r ON r.project_id = p.id
GROUP BY p.id, p.name, p.user_id;
```

## After Fixing

1. Refresh your frontend
2. Log out and log back in (to refresh the token)
3. Select a project - roadmaps should now appear!



