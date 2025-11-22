# Environment Variables Setup

To connect to your Supabase project, you'll need to set up environment variables.

**Good news**: You can test edge functions **without Docker**! Just create a `.env` file and use `supabase functions serve --env-file .env`.

## Required Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://app.supabase.com/project/YOUR_PROJECT_REF/settings/api

# Project Reference ID (found in project settings)
SUPABASE_PROJECT_REF=yoxuhgzmxmrzxzrxrlky

# API Keys (found in project settings > API)
SUPABASE_URL=https://yoxuhgzmxmrzxzrxrlky.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Getting Your API Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (Brain - yoxuhgzmxmrzxzrxrlky)
3. Navigate to **Settings** > **API**
4. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Edge Functions Secrets

For edge functions, you can set secrets using the Supabase CLI:

```bash
# Set a secret
supabase secrets set SECRET_NAME=secret_value

# List all secrets
supabase secrets list

# Unset a secret
supabase secrets unset SECRET_NAME
```

Secrets are automatically available in deployed functions via `Deno.env.get('SECRET_NAME')`.

## Local Development

When running `supabase functions serve`, the functions will automatically use:
- Remote Supabase URL and keys (from your linked project)
- Local function code (for fast iteration)

This means you can test functions locally while keeping data in the cloud.

