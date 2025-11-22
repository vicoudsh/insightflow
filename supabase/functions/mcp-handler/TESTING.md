# Testing the MCP Handler Edge Function

This guide provides comprehensive instructions for testing the MCP Handler Edge Function locally and in production.

## Prerequisites

1. **Supabase CLI** installed and configured
2. **Access Token** from Supabase Auth (for authenticated endpoints)
3. **curl** or **httpie** for making HTTP requests
4. **jq** (optional, for pretty JSON output)

## Quick Start

### 1. Get Your Access Token

You need a Supabase access token to test authenticated endpoints. Here are a few ways to get it:

#### Option A: From Browser Console (After Login)

1. Open your app and login
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:
   ```javascript
   const { data: { session } } = await supabase.auth.getSession()
   console.log('Access Token:', session?.access_token)
   ```

#### Option B: Using Supabase CLI

```bash
supabase auth token
```

#### Option C: Manual Token (for testing)

If you have a user account, you can get a token programmatically or from the Supabase dashboard.

### 2. Test Locally

#### Start Local Supabase (if not already running)

```bash
cd supabase
supabase start
```

This will start all Supabase services including Edge Functions.

#### Serve the Edge Function

```bash
cd supabase
supabase functions serve mcp-handler --no-verify-jwt
```

**Note:** The `--no-verify-jwt` flag allows you to test without valid JWT tokens. For production-like testing, omit this flag.

#### Run Tests

Use the provided test script:

```bash
cd supabase/functions/mcp-handler
chmod +x test.sh
export ACCESS_TOKEN='your_token_here'
./test.sh local
```

Or test manually with curl commands (see examples below).

### 3. Test Remote (Deployed)

First, deploy the function:

```bash
cd supabase
supabase functions deploy mcp-handler
```

Then run tests against your deployed instance:

```bash
cd supabase/functions/mcp-handler
export ACCESS_TOKEN='your_token_here'
# Update BASE_URL in test.sh with your Supabase project URL
./test.sh remote
```

## Manual Testing Examples

### 1. Tools Discovery (Public - No Auth)

```bash
# Local
curl http://localhost:54321/functions/v1/mcp-handler/tools | jq

# Remote
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/mcp-handler/tools | jq
```

**Expected Response:**
```json
{
  "tools": [
    {
      "name": "projects/list",
      "description": "List all projects",
      "inputSchema": { ... }
    },
    ...
  ]
}
```

### 2. List Projects (Requires Auth)

```bash
export ACCESS_TOKEN='your_token_here'

# Local
curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list",
    "page": 1,
    "limit": 10
  }' | jq

# Remote
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list",
    "page": 1,
    "limit": 10
  }' | jq
```

**Expected Response:**
```json
{
  "tool": "projects/list",
  "success": true,
  "result": {
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### 3. Create Project

```bash
curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/create",
    "name": "Test Project",
    "description": "Created via MCP Handler",
    "status": "active"
  }' | jq
```

**Expected Response:**
```json
{
  "tool": "projects/create",
  "success": true,
  "result": {
    "id": "uuid-here",
    "name": "Test Project",
    "description": "Created via MCP Handler",
    "status": "active",
    "user_id": "user-uuid-here",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get Project

```bash
PROJECT_ID='uuid-from-create-response'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"projects/get\",
    \"project_id\": \"$PROJECT_ID\"
  }" | jq
```

### 5. Update Project

```bash
PROJECT_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"projects/update\",
    \"project_id\": \"$PROJECT_ID\",
    \"name\": \"Updated Project Name\",
    \"status\": \"completed\"
  }" | jq
```

### 6. Create Stack

```bash
PROJECT_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"stacks/create\",
    \"project_id\": \"$PROJECT_ID\",
    \"name\": \"React\",
    \"technology\": \"Frontend Framework\",
    \"description\": \"Modern UI library\"
  }" | jq
```

### 7. List Roadmaps

```bash
PROJECT_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"roadmaps/list\",
    \"project_id\": \"$PROJECT_ID\",
    \"page\": 1,
    \"limit\": 10
  }" | jq
```

### 8. Create Roadmap

```bash
PROJECT_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"roadmaps/create\",
    \"project_id\": \"$PROJECT_ID\",
    \"name\": \"Q1 2024 Roadmap\",
    \"description\": \"First quarter goals\",
    \"status\": \"draft\"
  }" | jq
```

### 9. Get Roadmap with Tasks

```bash
ROADMAP_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"roadmaps/get\",
    \"roadmap_id\": \"$ROADMAP_ID\"
  }" | jq
```

**Expected Response:**
```json
{
  "tool": "roadmaps/get",
  "success": true,
  "result": {
    "id": "uuid-here",
    "name": "Q1 2024 Roadmap",
    "project_id": "uuid-here",
    "tasks": [
      {
        "id": "task-uuid",
        "name": "Task 1",
        "subtasks": [ ... ]
      }
    ]
  }
}
```

### 10. Create Task

```bash
ROADMAP_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"tasks/create\",
    \"roadmap_id\": \"$ROADMAP_ID\",
    \"name\": \"Implement Authentication\",
    \"description\": \"Add user auth flow\",
    \"status\": \"pending\",
    \"priority\": \"high\"
  }" | jq
```

### 11. Create Subtask

```bash
TASK_ID='uuid-here'

curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"subtasks/create\",
    \"task_id\": \"$TASK_ID\",
    \"name\": \"Setup Supabase Auth\",
    \"description\": \"Configure authentication provider\",
    \"completed\": false
  }" | jq
```

### 12. Error Handling - Missing Auth

```bash
curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list"
  }' | jq
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

### 13. Error Handling - Invalid Tool

```bash
curl -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "invalid/tool"
  }' | jq
```

**Expected Response:**
```json
{
  "tool": "invalid/tool",
  "success": false,
  "error": "Bad Request",
  "message": "Unknown tool: invalid/tool"
}
```

## Testing Checklist

- [ ] Tools discovery endpoint works (no auth required)
- [ ] List projects works with valid token
- [ ] Create project works and returns correct data
- [ ] Get project works with valid project_id
- [ ] Update project works and updates correctly
- [ ] Delete project works and removes data
- [ ] List stacks works with project_id filter
- [ ] Create stack works and links to project
- [ ] List roadmaps works with project_id
- [ ] Create roadmap works and links to project
- [ ] Get roadmap returns tasks and subtasks
- [ ] Create task works and links to roadmap
- [ ] Create subtask works and links to task
- [ ] Error handling works for missing auth
- [ ] Error handling works for invalid tool names
- [ ] Error handling works for missing required fields
- [ ] RLS enforcement works (users can't access others' data)

## Debugging

### View Function Logs

```bash
# Local
supabase functions logs mcp-handler

# Remote
supabase functions logs mcp-handler --project-ref YOUR_PROJECT_ID
```

### Test with Verbose Output

```bash
curl -v -X POST http://localhost:54321/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list"
  }'
```

### Check Function Status

```bash
# Local - check if function is running
ps aux | grep "functions serve"

# Remote - check deployment
supabase functions list --project-ref YOUR_PROJECT_ID
```

## Common Issues

### Issue: "Unauthorized" even with valid token

**Solution:** 
- Make sure token is prefixed with `Bearer `
- Check token hasn't expired
- Verify you're using the correct Supabase project

### Issue: "Function not found"

**Solution:**
- Ensure function is deployed: `supabase functions deploy mcp-handler`
- Check function name matches exactly
- Verify you're using the correct URL

### Issue: "Row Level Security" errors

**Solution:**
- Ensure `user_id` is set on projects
- Verify RLS policies are enabled
- Check that your token belongs to the correct user

### Issue: Connection refused (local testing)

**Solution:**
- Make sure Supabase is running: `supabase start`
- Verify function is being served: `supabase functions serve mcp-handler`
- Check the port matches your request (default: 54321)

## Next Steps

After testing:
1. ✅ All tests pass
2. ✅ Deploy to production
3. ✅ Update API documentation with Edge Function URL
4. ✅ Integrate with OpenAI or other AI tools
5. ✅ Set up monitoring and logging

