# OpenAPI Schema Edge Function

This Edge Function serves the OpenAPI 3.1.0 specification for the InsightFlow MCP Server.

## ✅ Public Access (No Authentication Required!)

**Public URL:** `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi`

The OpenAPI schema is now **publicly accessible without authentication**. You can access it directly:

```bash
curl https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi
```

Or in a browser:
```
https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi
```

## 🧪 Quick Test

```bash
# Direct access - no auth required!
curl https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi | head -20
```

## ✅ Deployment Status

- **Status:** ✅ Deployed
- **Project:** Brain (yoxuhgzmxmrzxzrxrlky)
- **Function:** `openapi`
- **Format:** YAML (OpenAPI 3.1.0)
- **Authentication:** None required (publicly accessible)

## 📋 What's Included

The OpenAPI schema includes:

- **API Information:** Title, description, version, contact
- **Server URL:** Points to the MCP Handler Edge Function
- **Security:** Bearer token authentication scheme (for the MCP handler, not this endpoint)
- **Endpoints:**
  - `GET /tools` - List available MCP tools
  - `POST /` - Execute any MCP tool
- **Schemas:** Tool, MCPResponse schemas
- **Examples:** Request/response examples

## 🔗 Usage with OpenAI Plugin

This URL can be used directly in the OpenAI plugin manifest:

```json
{
  "api": {
    "type": "openapi",
    "url": "https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi",
    "is_user_authenticated": true
  }
}
```

Note: The `is_user_authenticated` refers to the MCP handler endpoints, not this OpenAPI schema endpoint.

## 🔄 Redeployment

To redeploy after changes:

```bash
cd supabase
supabase functions deploy openapi --project-ref yoxuhgzmxmrzxzrxrlky --no-verify-jwt
```

## 📝 Content Type

The function returns:
- **Content-Type:** `application/json; charset=utf-8`
- **Format:** OpenAPI 3.1.0 JSON specification
- **Filename:** `openapi.json`
- **Default Format:** JSON (no parameters needed)

**Note:** YAML format is not available - this endpoint serves JSON only.

## 🔍 View in Swagger UI

You can view the OpenAPI schema in Swagger UI:

1. Go to: https://editor.swagger.io/
2. Click "File" → "Import URL"
3. Enter: `https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/openapi`
4. Click "OK"

Or use the URL directly in other OpenAPI tools.

## 📚 Related Documentation

- **MCP Handler Function:** `supabase/functions/mcp-handler/README.md`
- **OpenAPI Spec File:** `backend/.well-known/openapi.yaml`
