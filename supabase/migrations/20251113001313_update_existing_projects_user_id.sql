-- Update existing projects with user_id
-- This migration handles the case where projects were created before the user_id column existed
-- 
-- IMPORTANT: This migration attempts to assign projects to users, but if there's no way to
-- determine ownership, you'll need to manually update projects with their correct user_id.
--
-- Option 1: If you have a way to determine ownership (e.g., created_by, email, etc.)
-- Option 2: Manually update projects in Supabase dashboard
-- Option 3: Delete old projects and recreate them with proper user_id

-- ============================================================================
-- STEP 1: Check if there are projects with NULL user_id
-- ============================================================================

-- Count projects with NULL user_id (this is just for information)
DO $$
DECLARE
  null_user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_user_count
  FROM projects
  WHERE user_id IS NULL;
  
  IF null_user_count > 0 THEN
    RAISE NOTICE 'Found % projects with NULL user_id. These projects will not be accessible via RLS until user_id is set.', null_user_count;
  ELSE
    RAISE NOTICE 'All projects have user_id set. No updates needed.';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Optional - Set user_id for projects based on created_at or other logic
-- ============================================================================
-- 
-- UNCOMMENT AND MODIFY THIS SECTION IF YOU HAVE A WAY TO DETERMINE OWNERSHIP
-- 
-- Example: Assign all projects with NULL user_id to the first user (NOT RECOMMENDED FOR PRODUCTION)
-- 
-- UPDATE projects
-- SET user_id = (
--   SELECT id FROM auth.users 
--   ORDER BY created_at ASC 
--   LIMIT 1
-- )
-- WHERE user_id IS NULL;
--
-- Example: If you have a created_by column or email field
-- 
-- UPDATE projects p
-- SET user_id = (
--   SELECT id FROM auth.users u
--   WHERE u.email = p.created_by_email  -- or whatever field you have
--   LIMIT 1
-- )
-- WHERE p.user_id IS NULL;

-- ============================================================================
-- STEP 3: Make user_id NOT NULL (optional, but recommended)
-- ============================================================================
-- 
-- UNCOMMENT THIS SECTION AFTER YOU'VE UPDATED ALL NULL user_id VALUES
-- 
-- ALTER TABLE projects
-- ALTER COLUMN user_id SET NOT NULL;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 
-- 1. If you have existing projects without user_id, you need to manually assign them
--    to users in the Supabase dashboard or via SQL:
--    
--    UPDATE projects 
--    SET user_id = 'USER_UUID_HERE' 
--    WHERE id = 'PROJECT_UUID_HERE';
--
-- 2. After updating all projects, you can make user_id NOT NULL to enforce
--    that all new projects must have a user_id.
--
-- 3. If you don't know which user owns which project, you may need to:
--    - Delete old projects and recreate them with proper user_id
--    - Or contact users to reassign their projects
--
-- 4. For future projects, the backend automatically sets user_id when creating
--    projects (see backend/src/controllers/projectsController.js)



