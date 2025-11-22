# Edge Functions

This directory contains Supabase edge functions for the InsightFlow project.

## Quick Start

### Deploy to Cloud (No Docker Needed!)

```bash
# Deploy a function
./deploy.sh hello-world

# Test the deployed function
./test-cloud.sh hello-world
```

## Available Functions

- **hello-world** - Basic example function
- **example-with-supabase** - Function with Supabase client integration

## Structure

```
functions/
├── _shared/              # Shared utilities (CORS, helpers)
│   └── cors.ts
├── hello-world/          # Example function
│   ├── index.ts
│   └── README.md
├── example-with-supabase/ # Supabase integration example
│   ├── index.ts
│   └── README.md
├── deploy.sh            # Deploy script
├── test-cloud.sh        # Test deployed functions
├── deno.json           # Deno configuration
└── README.md           # This file
```

## Scripts

### `deploy.sh`
Deploy functions to Supabase cloud:
```bash
./deploy.sh hello-world  # Deploy specific function
./deploy.sh              # Deploy all functions
```

### `test-cloud.sh`
Test functions deployed on the cloud:
```bash
./test-cloud.sh hello-world
```

## Creating a New Function

1. Create a new directory:
   ```bash
   mkdir supabase/functions/my-function
   ```

2. Create `index.ts`:
   ```typescript
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { corsHeaders } from '../_shared/cors.ts'

   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     return new Response(
       JSON.stringify({ message: 'Hello from my-function!' }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     )
   })
   ```

3. Deploy:
   ```bash
   ./deploy.sh my-function
   ```

4. Test:
   ```bash
   ./test-cloud.sh my-function
   ```

## Environment Variables

Functions automatically get:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Your anon/public key
- Any secrets set via `supabase secrets set`

Access in your function:
```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
```

## Using Supabase Client

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
)

// Use supabase client...
```

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime Docs](https://deno.land/manual)
- See `DEPLOY.md` in project root for deployment guide

