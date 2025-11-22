# Making OpenAPI Function Publicly Accessible

If you're still getting authentication errors when accessing the OpenAPI schema, you may need to configure the function in the Supabase dashboard to allow unauthenticated access.

## Option 1: Deploy with --no-verify-jwt (Already Done)

The function is deployed with the `--no-verify-jwt` flag:
```bash
supabase functions deploy openapi --project-ref yoxuhgzmxmrzxzrxrlky --no-verify-jwt
```

## Option 2: Configure in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/functions
2. Find the `openapi` function
3. Click on it to view settings
4. Look for "Authentication" or "Security" settings
5. Enable "Allow unauthenticated access" or similar option
6. Save changes

## Option 3: Use Anon Key (Workaround)

If the function still requires auth, use the anon key (it's safe to expose):

```bash
export ANON_KEY='your_anon_key'

curl -X GET "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY"
```

Get your anon key from:
https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/settings/api

## Option 4: Verify Function Configuration

Check the function configuration:
```bash
supabase functions list --project-ref yoxuhgzmxmrzxzrxrlky
```

The function should show that JWT verification is disabled.

## Current Status

- ✅ Function code doesn't require authentication
- ✅ Deployed with `--no-verify-jwt` flag
- ✅ Auth keys accessible via environment variables
- ⚠️  May need dashboard configuration to allow unauthenticated access

The function serves the OpenAPI schema without needing client authentication - auth keys are accessed internally via environment variables.

