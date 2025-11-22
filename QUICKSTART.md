# Quick Start Guide - Supabase Edge Functions

## ✅ Setup Complete!

Your Supabase project is connected and ready for edge functions development.

## Current Status

- ✅ Project linked to: **Brain** (yoxuhgzmxmrzxzrxrlky)
- ✅ Edge functions directory created
- ✅ Example functions ready
- ✅ Cloud deployment ready

## Quick Commands

### 🚀 Deploy to Cloud (Recommended - No Docker!)

```bash
# Deploy a function
./supabase/functions/deploy.sh hello-world

# Deploy all functions
./supabase/functions/deploy.sh

# Test the deployed function
./supabase/functions/test-cloud.sh hello-world
```

**This is the simplest approach - no Docker needed!** Just deploy and test on the cloud.

### Deploy Functions

```bash
# Using the script (recommended)
./supabase/functions/deploy.sh hello-world

# Or manually
supabase functions deploy hello-world
supabase functions deploy  # Deploy all
```

## Available Functions

1. **hello-world** - Basic example function
2. **example-with-supabase** - Function with Supabase client integration

## Project Structure

```
supabase/
├── functions/
│   ├── _shared/              # Shared utilities
│   │   └── cors.ts
│   ├── hello-world/          # Example function
│   │   ├── index.ts
│   │   └── README.md
│   ├── example-with-supabase/ # Supabase integration example
│   │   ├── index.ts
│   │   └── README.md
│   ├── deploy.sh            # Deploy script
│   ├── test-cloud.sh        # Test script
│   └── deno.json            # Deno configuration
├── migrations/              # Database migrations
└── config.toml             # Supabase configuration
```

## Important Notes

1. **Environment Variables**: Functions automatically get `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your linked project. No manual configuration needed!

2. **Secrets**: Use `supabase secrets set KEY=value` to set secrets for deployed functions.

3. **No Docker Required**: Deploy and test directly on the cloud - no local setup needed!

## Next Steps

1. Create your own edge functions in `supabase/functions/`
2. Deploy using `./supabase/functions/deploy.sh your-function`
3. Test using `./supabase/functions/test-cloud.sh your-function`

For detailed documentation, see `supabase/README.md`

