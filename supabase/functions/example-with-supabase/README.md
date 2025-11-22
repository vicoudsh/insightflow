# Example Function with Supabase Client

This function demonstrates how to:
- Connect to Supabase from an edge function
- Handle authentication
- Use the Supabase client

## Quick Start

### Deploy to Cloud (No Docker Needed!)

```bash
# Deploy the function
./deploy.sh example-with-supabase

# Test the deployed function
./test-cloud.sh example-with-supabase
```

### Manual Deployment

```bash
# Deploy
supabase functions deploy example-with-supabase

# Test without auth
curl -i --location --request GET 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/example-with-supabase' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'

# Test with user auth token
curl -i --location --request GET 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/example-with-supabase' \
  --header 'Authorization: Bearer USER_ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

## Environment Variables

The function automatically uses:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Your anon/public key

These are automatically set when the function is deployed (from your linked project).

