# Hello World Edge Function

A simple example edge function that demonstrates basic request handling.

## Quick Start

### Deploy to Cloud (No Docker Needed!)

```bash
# Deploy the function
./deploy.sh hello-world

# Test the deployed function
./test-cloud.sh hello-world
```

### Manual Deployment

```bash
# Deploy
supabase functions deploy hello-world

# Test
curl -i --location --request POST 'https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/hello-world' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"InsightFlow"}'
```

## What It Does

This function accepts a POST request with an optional `name` parameter and returns a greeting message.

**Request:**
```json
{
  "name": "InsightFlow"
}
```

**Response:**
```json
{
  "message": "Hello InsightFlow!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

