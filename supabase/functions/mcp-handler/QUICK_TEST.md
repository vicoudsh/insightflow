# Quick Test Guide - Cloud Deployment

## ✅ Function Deployed Successfully!

**Function URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler`

## 🧪 Testing Options

### Option 1: Test Tools Discovery (with Anon Key)

Supabase Edge Functions require authentication. Use your project's anon key for public endpoints:

```bash
export ANON_KEY='your_supabase_anon_key'

curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler/tools" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" | jq
```

**To get your anon key:**
1. Go to https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/settings/api
2. Copy the "anon" or "public" key

### Option 2: Test with User Access Token

For authenticated operations, use a user access token:

```bash
export ACCESS_TOKEN='your_user_access_token'

# Test Tools Discovery
curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler/tools" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" | jq

# Test List Projects
curl -X POST "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list",
    "page": 1,
    "limit": 10
  }' | jq

# Test Create Project
curl -X POST "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/create",
    "name": "Test Project",
    "description": "Testing MCP Handler",
    "status": "active"
  }' | jq
```

### Option 3: Using the Test Script

Update the script with your tokens and run:

```bash
cd supabase/functions/mcp-handler
export ACCESS_TOKEN='your_user_access_token'
export ANON_KEY='your_anon_key'
./test.sh remote
```

## 🔑 Getting Your Tokens

### Anon Key (for testing public endpoints)
1. Go to: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/settings/api
2. Copy the "anon public" key

### User Access Token (for authenticated operations)

**Method 1: From Browser Console (if logged into your app)**
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Access Token:', session?.access_token)
```

**Method 2: From Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/auth/users
2. Create or select a test user
3. Generate a JWT token for that user

**Method 3: Programmatically**
```javascript
// In your app after login
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password'
})
console.log('Access Token:', session?.access_token)
```

## 📝 Example: Complete Test Flow

```bash
# Set your tokens
export ANON_KEY='your_anon_key'
export ACCESS_TOKEN='your_user_access_token'

# 1. Test Tools Discovery
echo "Testing Tools Discovery..."
curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler/tools" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" | jq '.tools | length'

# 2. List Projects
echo "Listing Projects..."
curl -X POST "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tool": "projects/list", "page": 1, "limit": 10}' | jq

# 3. Create Project
echo "Creating Project..."
RESPONSE=$(curl -s -X POST "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/create",
    "name": "Test Project from Cloud",
    "description": "Created via MCP Handler Edge Function",
    "status": "active"
  }')

echo "$RESPONSE" | jq
PROJECT_ID=$(echo "$RESPONSE" | jq -r '.result.id')
echo "Created Project ID: $PROJECT_ID"
```

## 🔍 View Function Logs

```bash
supabase functions logs mcp-handler --project-ref yoxuhgzmxmrzxzrxrlky
```

Or view in dashboard:
https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/functions

## ✅ Verification Checklist

- [ ] Tools discovery endpoint works (with anon key)
- [ ] List projects works (with user token)
- [ ] Create project works
- [ ] Get project works
- [ ] All CRUD operations work
- [ ] Error handling works correctly
- [ ] RLS enforcement works (users can't access others' data)

## 🚨 Troubleshooting

**Error: "Missing authorization header"**
- Make sure you're including the `Authorization: Bearer <token>` header
- For tools discovery, use your anon key
- For authenticated operations, use a user access token

**Error: "Invalid token"**
- Verify your token hasn't expired
- Make sure you're using the correct token type (anon vs user token)
- Check that the token belongs to the correct Supabase project

**Error: "Not Found" or "Route not found"**
- Verify the function URL is correct
- Check that the function is deployed: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/functions

**Function not accessible**
- Check function logs for errors
- Verify your Supabase project is active
- Ensure you have the correct project reference ID

