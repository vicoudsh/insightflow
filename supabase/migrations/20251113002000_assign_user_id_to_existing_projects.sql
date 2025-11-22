-- Assign user_id to existing projects that don't have one
-- This migration handles the case where projects were created before user_id column existed

-- ============================================================================
-- STEP 1: Check current state
-- ============================================================================

DO $$
DECLARE
  null_user_count INTEGER;
  total_projects INTEGER;
  first_user_id UUID;
BEGIN
  -- Count projects with NULL user_id
  SELECT COUNT(*) INTO null_user_count
  FROM projects
  WHERE user_id IS NULL;
  
  -- Count total projects
  SELECT COUNT(*) INTO total_projects
  FROM projects;
  
  -- Get first user (as fallback)
  SELECT id INTO first_user_id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;
  
  RAISE NOTICE 'Total projects: %', total_projects;
  RAISE NOTICE 'Projects with NULL user_id: %', null_user_count;
  
  IF null_user_count > 0 THEN
    IF first_user_id IS NOT NULL THEN
      RAISE NOTICE 'Assigning % projects to user: %', null_user_count, first_user_id;
      
      -- Update all projects with NULL user_id to the first user
      -- NOTE: This is a temporary fix - you should manually verify and update ownership
      UPDATE projects
      SET user_id = first_user_id
      WHERE user_id IS NULL;
      
      RAISE NOTICE 'Updated % projects with user_id', null_user_count;
    ELSE
      RAISE WARNING 'No users found in auth.users. Cannot assign user_id to projects.';
      RAISE WARNING 'Please manually update projects with their correct user_id.';
    END IF;
  ELSE
    RAISE NOTICE 'All projects already have user_id set.';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Verify all projects have user_id
-- ============================================================================

DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM projects
  WHERE user_id IS NULL;
  
  IF null_count > 0 THEN
    RAISE WARNING 'WARNING: % projects still have NULL user_id. These projects will not be accessible via RLS.', null_count;
    RAISE WARNING 'Please update these projects manually in Supabase dashboard:';
    RAISE WARNING 'UPDATE projects SET user_id = ''USER_UUID'' WHERE user_id IS NULL;';
  ELSE
    RAISE NOTICE 'SUCCESS: All projects now have user_id set.';
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Optional - Make user_id NOT NULL (uncomment after verifying)
-- ============================================================================

-- Uncomment this section AFTER verifying all projects have user_id set:
-- 
-- ALTER TABLE projects
-- ALTER COLUMN user_id SET NOT NULL;



