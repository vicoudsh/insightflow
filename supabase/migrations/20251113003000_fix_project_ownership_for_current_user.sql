-- Fix Project Ownership - Assign all projects to the first user
-- This is a quick fix to ensure projects are accessible via RLS
-- 
-- IMPORTANT: This assigns all projects to the FIRST user (oldest user).
-- If you have multiple users, you should manually assign projects to the correct user.
-- See FIX_PROJECT_OWNERSHIP.md for detailed instructions.

DO $$
DECLARE
  first_user_id UUID;
  updated_count INTEGER;
  user_email TEXT;
BEGIN
  -- Get the first user (oldest user)
  SELECT id, email INTO first_user_id, user_email
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    RAISE NOTICE 'Found user: % (%)', user_email, first_user_id;
    
    -- Update all projects to belong to this user
    UPDATE projects
    SET user_id = first_user_id
    WHERE user_id IS NULL OR user_id != first_user_id;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RAISE NOTICE 'Updated % projects to user: % (%)', updated_count, user_email, first_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '✅ All projects now belong to: %', user_email;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  If you are logged in as a different user, you need to:';
    RAISE NOTICE '   1. Find your user ID from Supabase dashboard or backend logs';
    RAISE NOTICE '   2. Run: UPDATE projects SET user_id = ''YOUR_USER_ID'';';
    RAISE NOTICE '   3. See FIX_PROJECT_OWNERSHIP.md for detailed instructions';
  ELSE
    RAISE WARNING '❌ No users found in auth.users table!';
    RAISE WARNING '   Please create a user first, then run this migration again.';
  END IF;
END $$;

