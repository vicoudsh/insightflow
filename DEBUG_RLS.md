# Debug RLS Issues

## Current Status

✅ **Projects now have `user_id` set**: All projects belong to user `v.deschamps354@gmail.com` (ID: `50ddb127-ffc0-4186-94e0-cd4f29a16215`)

✅ **RLS policies are in place**: Policies exist for all tables (projects, roadmaps, stacks, tasks, subtasks)

## Verify You're Logged In as the Correct User

### Step 1: Check Your User ID in Frontend

1. Open browser developer console (F12)
2. Go to the **Console** tab
3. When you make an API request, check the backend logs for:
   ```
   ✅ [AUTH MIDDLEWARE] Token verified, user ID: ...
   ✅ [AUTH MIDDLEWARE] User email: ...
   ```

### Step 2: Verify Project Ownership

Run this SQL in Supabase SQL Editor:

```sql
-- Check project ownership
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.user_id as project_owner_id,
  u.email as project_owner_email,
  (SELECT COUNT(*) FROM roadmaps WHERE project_id = p.id) as roadmap_count
FROM projects p
LEFT JOIN auth.users u ON u.id = p.user_id;
```

### Step 3: Test RLS Directly

Run this SQL **as the authenticated user** (in Supabase SQL Editor, you're running as the service role, so RLS won't apply). Instead, test via the API:

**Test via API:**
```bash
# Get your token from localStorage or Supabase session
curl -X GET "http://localhost:3001/api/roadmaps?project_id=YOUR_PROJECT_ID&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Common Issues

### Issue 1: User ID Mismatch

**Problem**: You're logged in as user A, but projects belong to user B.

**Solution**: 
1. Find your user ID from backend logs or Supabase dashboard
2. Update projects to your user ID:
   ```sql
   UPDATE projects 
   SET user_id = 'YOUR_USER_ID_HERE';
   ```

### Issue 2: Token Not Being Passed

**Problem**: Frontend is not sending the authentication token.

**Check**:
1. Open browser developer console
2. Go to **Network** tab
3. Find the API request to `/api/roadmaps`
4. Check the **Headers** section
5. Verify `Authorization: Bearer ...` is present

**Fix**: 
- Make sure you're logged in
- Check that `localStorage.getItem('auth_token')` returns a token
- Verify the token is being included in API requests

### Issue 3: RLS Policies Not Working

**Problem**: RLS policies exist but are not being applied.

**Check**:
1. Verify RLS is enabled on all tables:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
     AND tablename IN ('projects', 'roadmaps', 'stacks', 'tasks', 'subtasks');
   ```
   All should return `t` (true).

2. Verify policies exist:
   ```sql
   SELECT tablename, policyname, cmd 
   FROM pg_policies 
   WHERE tablename IN ('projects', 'roadmaps', 'stacks', 'tasks', 'subtasks')
   ORDER BY tablename, cmd;
   ```
   Should return 20 policies (4 per table × 5 tables).

### Issue 4: Project Doesn't Exist or project_id is Wrong

**Problem**: The `project_id` in the query doesn't match any project.

**Check**:
1. Verify the project exists:
   ```sql
   SELECT id, name, user_id FROM projects;
   ```
2. Check backend logs for:
   ```
   🔍 [DEBUG] Project found: ...
   🔍 [DEBUG] Project user_id: ...
   🔍 [DEBUG] Current user_id: ...
   🔍 [DEBUG] User IDs match: ...
   ```

## Quick Test

Run this to test if RLS is working:

1. **Start the backend server** (if not running):
   ```bash
   cd backend
   npm run dev
   ```

2. **Check backend logs** when you make a request:
   - Look for `✅ [AUTH MIDDLEWARE] Token verified, user ID: ...`
   - Look for `🔍 [DEBUG] Project found: ...`
   - Look for `🔍 [DEBUG] User IDs match: ...`
   - Look for `Roadmaps data: ...`

3. **Check frontend console**:
   - Look for `🌐 [FRONTEND API REQUEST]`
   - Look for `🌐 [FRONTEND API RESPONSE]`
   - Look for `🌐 [FRONTEND API RESPONSE DATA]`

## Next Steps

If roadmaps still don't appear:

1. **Check backend logs** - Look for errors or warnings
2. **Check frontend console** - Look for API errors
3. **Verify user ID matches** - Ensure logged-in user matches project owner
4. **Test RLS directly** - Use the SQL queries above to verify RLS is working

## Get Help

If you're still having issues, provide:
1. Backend logs (especially auth middleware and roadmaps controller logs)
2. Frontend console logs (especially API request/response logs)
3. Your user ID (from backend logs)
4. Project ID you're trying to access
5. Project owner user ID (from database)



