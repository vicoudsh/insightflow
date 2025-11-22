# Supabase Edge Functions Setup

This directory contains the Supabase configuration and edge functions for the InsightFlow project.

## Prerequisites

1. **Supabase CLI**: Install from [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)
2. **Deno**: Edge functions run on Deno runtime (automatically managed by Supabase CLI)

**Note**: Docker is NOT required for deploying and testing edge functions on the cloud!

## Project Connection

The project is linked to the remote Supabase project "Brain" (project ref: `yoxuhgzmxmrzxzrxrlky`).

### Linking to Remote Project

If you need to re-link or link to a different project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Development & Deployment

### 🚀 Deploy to Cloud (Recommended - No Docker!)

The simplest way to work with edge functions is to deploy directly to the cloud:

```bash
# Deploy a function
./supabase/functions/deploy.sh hello-world

# Test the deployed function
./supabase/functions/test-cloud.sh hello-world
```

See `DEPLOY.md` for complete deployment guide.

## Deploying Functions

### Quick Deploy

```bash
# Deploy a specific function
./supabase/functions/deploy.sh hello-world

# Deploy all functions
./supabase/functions/deploy.sh
```

### Manual Deploy

```bash
# Deploy a single function
supabase functions deploy hello-world

# Deploy all functions
supabase functions deploy
```

### Deploy with Secrets

```bash
# Set a secret
supabase secrets set MY_SECRET=secret_value

# Secrets are automatically available in deployed functions via Deno.env.get()
```

## Environment Variables

1. Copy `.env.example` to `.env` (if it doesn't exist)
2. Fill in your Supabase project credentials from the [Supabase Dashboard](https://app.supabase.com)

**Important**: Never commit `.env` files to git. They are already in `.gitignore`.

## Function Structure

```
supabase/functions/
├── _shared/          # Shared utilities (CORS, helpers, etc.)
├── hello-world/      # Example function
│   ├── index.ts      # Function entry point
│   └── README.md     # Function-specific docs
└── deno.json         # Deno configuration
```

## Accessing Supabase Client in Functions

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!

const supabase = createClient(supabaseUrl, supabaseKey)

// Use supabase client...
```

## Useful Commands

```bash
# Check project status
supabase status

# View logs
supabase functions logs hello-world

# List all functions
supabase functions list

# Delete a function
supabase functions delete hello-world

# Stop local Supabase
supabase stop

# Reset local database (WARNING: deletes all local data)
supabase db reset
```

## Troubleshooting

### Docker Not Running
If you see Docker errors, make sure Docker Desktop is running:
```bash
# Check Docker status
docker ps
```

### Port Already in Use
If ports are already in use, you can change them in `config.toml` or stop the conflicting services.

### Functions Not Connecting to Remote
Make sure your project is linked:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime Docs](https://deno.land/manual)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

