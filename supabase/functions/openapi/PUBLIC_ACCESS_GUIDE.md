# Making OpenAPI Function Publicly Accessible

The OpenAPI schema function is **PUBLICLY ACCESSIBLE** - no authentication required from clients.

## ✅ Current Status

- ✅ Function code doesn't require authentication
- ✅ Deployed with `--no-verify-jwt` flag
- ✅ Auth keys accessible via environment variables (automatically available)
- ✅ Function works without client auth headers

## 🔑 Auth Keys Included Directly

The function automatically uses auth keys from Supabase environment variables:

- `SUPABASE_URL` - Automatically available in Edge Functions
- `SUPABASE_ANON_KEY` - Automatically available in Edge Functions

**These are injected by Supabase at runtime** - no need for clients to provide them.

## 📝 For OpenAI / AI Tools

When configuring for OpenAI plugins or AI tools, use:

**OpenAPI Schema URL:**
```
https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi
```

**No authentication required** - the function serves the schema publicly.

The auth keys are handled internally via environment variables that Supabase automatically provides.

## 🧪 Test It

```bash
# Direct access - no auth required
curl https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi | jq '.openapi'

# Should return: "3.1.0"
```

## ⚠️ If You Still Get 401 Errors

If you're still getting authentication errors, it might be:

1. **Platform-level security** - Supabase may require auth headers at platform level
2. **Solution:** Configure the function in Supabase dashboard to allow unauthenticated access
3. **Or:** Use anon key in request (it's safe to expose):

```bash
export ANON_KEY='your_anon_key'
curl -H "Authorization: Bearer $ANON_KEY" \
     -H "apikey: $ANON_KEY" \
     https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi
```

But the function **itself** doesn't need or validate these - they're just for Supabase's platform-level checks.

## 🔧 Configuration

The function is configured to:
- ✅ Serve OpenAPI JSON schema
- ✅ Use auth keys from environment variables (no client auth needed)
- ✅ Be publicly accessible
- ✅ Handle requests without auth headers

Auth keys are **included directly** in the function via Supabase's automatic environment variable injection.

