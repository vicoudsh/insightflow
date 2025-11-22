# Public Access to OpenAPI Schema

## Current Status

The OpenAPI schema endpoint is **publicly accessible** but requires the anon key in the Authorization header (Supabase platform requirement).

**Public URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi`

## How to Access

### Option 1: Using Anon Key (Recommended)

The anon key is safe to expose publicly (it's meant for client-side use):

```bash
curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY"
```

**Get your anon key:**
- Go to: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/settings/api
- Copy the "anon public" key

### Option 2: Configure Anonymous Access in Dashboard

To make it truly public (no auth header needed):

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Select the `openapi` function
4. Check "Allow anonymous access" or similar setting
5. Save changes

Note: This setting may not be available in all Supabase plans.

## Why Auth is Required

Supabase Edge Functions require an Authorization header at the platform level for security. This is a platform feature, not a function limitation. The function code itself doesn't validate authentication - it's enforced by Supabase's edge runtime.

## Solution: Use Anon Key

The anon key is designed to be public and safe to expose:
- It's already used in client-side code
- It respects Row Level Security (RLS) policies
- It's the standard way to access Supabase Edge Functions publicly

You can include it in:
- Documentation
- API clients
- Browser JavaScript
- Public repositories (it's already in your frontend code)

## Test Public Access

```bash
# Replace YOUR_ANON_KEY with your actual anon key
export ANON_KEY='your_anon_key'

curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" | head -30
```

The anon key acts as a "public" access token for this purpose.

