# MCP Handler - Cloud Deployment

## ✅ Deployment Status

The MCP Handler Edge Function has been successfully deployed to Supabase Cloud!

**Deployment Date:** $(date)
**Project:** Brain (yoxuhgzmxmrzxzrxrlky)
**Function URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler`

## 🌐 Endpoints

### Base URL
```
https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler
```

### Public Endpoints

#### Tools Discovery (No Auth Required)
```
GET https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler/tools
```

### Authenticated Endpoints

All other endpoints require authentication via Bearer token:

```
POST https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler
Authorization: Bearer <your_supabase_access_token>
Content-Type: application/json
```

## 🧪 Quick Test

### 1. Test Tools Discovery (Public)

```bash
curl https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler/tools | jq
```

### 2. Test List Projects (Requires Auth)

First, get your access token from your app or Supabase dashboard, then:

```bash
export ACCESS_TOKEN='your_token_here'

curl -X POST https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list",
    "page": 1,
    "limit": 10
  }' | jq
```

## 📋 Available Tools

See the `/tools` endpoint for the complete list. Available tool categories:

- **Projects:** list, get, create, update, delete
- **Stacks:** list, get, create, update, delete
- **Roadmaps:** list, get, create, update, delete
- **Tasks:** list, get, create, update, delete
- **Subtasks:** list, get, create, update, delete

## 🔗 Dashboard Links

- **Functions Dashboard:** https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/functions
- **Project Dashboard:** https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky

## 📝 Deployment Commands

To redeploy after making changes:

```bash
cd supabase
supabase functions deploy mcp-handler --project-ref yoxuhgzmxmrzxzrxrlky
```

## 🔍 View Logs

```bash
supabase functions logs mcp-handler --project-ref yoxuhgzmxmrzxzrxrlky
```

## 🔑 Getting Access Token

You need a Supabase access token to test authenticated endpoints:

### Option 1: From Your App
If you're logged into your app, open browser console and run:
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Access Token:', session?.access_token)
```

### Option 2: From Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/auth/users
2. Create or select a user
3. Generate a JWT token for testing

### Option 3: Using Supabase CLI
```bash
supabase auth token --project-ref yoxuhgzmxmrzxzrxrlky
```

## 📚 Full Documentation

See `README.md` and `TESTING.md` for comprehensive documentation.

