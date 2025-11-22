# Deploy Edge Functions to Cloud

This guide shows you how to deploy and test Supabase edge functions directly on the cloud - **no Docker needed!**

## Quick Start

### 1. Deploy a Function

```bash
# Deploy a specific function
./supabase/functions/deploy.sh hello-world

# Deploy all functions
./supabase/functions/deploy.sh
```

### 2. Test the Deployed Function

```bash
# Test a deployed function
./supabase/functions/test-cloud.sh hello-world
```

That's it! Your function is live on the cloud.

## Prerequisites

1. **Project Linked**: Your project should be linked to Supabase
   ```bash
   supabase link --project-ref yoxuhgzmxmrzxzrxrlky
   ```

2. **API Key**: Create a `.env` file with your Supabase credentials:
   ```bash
   SUPABASE_URL=https://yoxuhgzmxmrzxzrxrlky.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```
   
   Get your key from: https://app.supabase.com/project/yoxuhgzmxmrzxzrxrlky/settings/api

## Workflow

### Development Cycle

1. **Edit** your function code in `supabase/functions/your-function/index.ts`
2. **Deploy** to cloud:
   ```bash
   ./supabase/functions/deploy.sh your-function
   ```
3. **Test** the deployed function:
   ```bash
   ./supabase/functions/test-cloud.sh your-function
   ```
4. **Iterate** - repeat as needed!

### Manual Deployment

If you prefer to use the CLI directly:

```bash
# Deploy a specific function
supabase functions deploy hello-world

# Deploy all functions
supabase functions deploy

# View deployment logs
supabase functions logs hello-world
```

### Manual Testing

Test your deployed function directly:

```bash
curl -i --location --request POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/hello-world' \
  --header "Authorization: Bearer YOUR_ANON_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"name":"Test"}'
```

## Function URLs

Once deployed, your functions are available at:

```
https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/your-function-name
```

## Environment Variables & Secrets

### Setting Secrets

Secrets are automatically available in deployed functions:

```bash
# Set a secret
supabase secrets set MY_SECRET_KEY=secret_value

# List secrets
supabase secrets list

# Unset a secret
supabase secrets unset MY_SECRET_KEY
```

### Using Secrets in Functions

```typescript
const secret = Deno.env.get('MY_SECRET_KEY')
```

## Viewing Logs

```bash
# View logs for a function
supabase functions logs hello-world

# Follow logs in real-time
supabase functions logs hello-world --follow
```

## Managing Functions

```bash
# List all deployed functions
supabase functions list

# Delete a function
supabase functions delete hello-world
```

## Troubleshooting

### "Project not linked"
```bash
supabase link --project-ref yoxuhgzmxmrzxzrxrlky
```

### "Authentication failed"
- Make sure you're logged in: `supabase login`
- Verify your project is linked correctly

### "Function not found"
- Check the function name matches the directory name
- Ensure the function has an `index.ts` file

### "Permission denied"
- Make sure your `.env` file has the correct `SUPABASE_ANON_KEY`
- Verify the key has the right permissions in your Supabase project

## Benefits of Cloud Deployment

✅ **No Docker required** - Deploy directly from your machine  
✅ **Real environment** - Test in production-like conditions  
✅ **Fast iteration** - Deploy and test in seconds  
✅ **Production ready** - Same environment as your live app  
✅ **Easy debugging** - View logs in real-time  

## Next Steps

- Create your own functions in `supabase/functions/`
- Deploy and test them using the scripts
- Integrate them into your application

For more information, see:
- `supabase/README.md` - Complete Supabase setup guide
- `QUICKSTART.md` - Quick reference guide

