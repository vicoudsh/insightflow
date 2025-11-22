# Setting Environment Variables on Render.com

## Quick Steps

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your service** (or create a new Web Service connected to your GitHub repo)
3. **Navigate to**: Your Service → **Environment** tab
4. **Click**: **"Add Environment Variable"** for each variable below

## Required Environment Variables

Copy these from your `.env` file:

| Variable Name | Value Source |
|--------------|-------------|
| `SUPABASE_URL` | Copy from your `.env` file |
| `SUPABASE_ANON_KEY` | Copy from your `.env` file |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from your `.env` file |
| `NODE_ENV` | Set to: `production` |
| `PORT` | Set to: `3001` |
| `API_BASE_URL` | Set to: `https://your-render-url.onrender.com` (update after deployment) |
| `CORS_ORIGIN` | Set to your frontend URL (or `http://localhost:3000` for testing) |

## Get Your Environment Variables

Run this command to see all your environment variables:

```bash
cd backend
cat .env | grep -v "^#" | grep -v "^$"
```

## Step-by-Step on Render

### 1. Create/Select Service

- Go to https://dashboard.render.com
- Click **"New +"** → **"Web Service"** (if creating new)
- Connect your GitHub repository: `vicoudsh/insightflow`
- Configure:
  - **Name**: `insightflow-backend`
  - **Environment**: `Node`
  - **Build Command**: `cd backend && npm install`
  - **Start Command**: `cd backend && npm start`

### 2. Add Environment Variables

1. Go to your service → **Environment** tab
2. For each variable below, click **"Add Environment Variable"**:
   - **Key**: Variable name (e.g., `SUPABASE_URL`)
   - **Value**: Value from your `.env` file

### 3. Required Variables List

Add these variables one by one:

```
SUPABASE_URL=<from your .env>
SUPABASE_ANON_KEY=<from your .env>
SUPABASE_SERVICE_ROLE_KEY=<from your .env>
NODE_ENV=production
PORT=3001
API_BASE_URL=https://insightflow-h2mw.onrender.com
CORS_ORIGIN=http://localhost:3000
```

### 4. After Deployment

1. Once deployed, Render will give you a URL like: `https://insightflow-xxx.onrender.com`
2. **Update** `API_BASE_URL` environment variable to match this URL
3. **Redeploy** the service (or it will auto-deploy if auto-deploy is enabled)

## Quick Copy Script

To quickly list all your environment variables for copying:

```bash
cd backend
./setup-render-env.sh
```

Or manually:

```bash
cd backend
cat .env | grep -v "^#" | grep -v "^$"
```

## Verification

After setting environment variables and deploying:

1. **Check Health**:
   ```bash
   curl https://your-render-url.onrender.com/health
   ```

2. **Check MCP Tools**:
   ```bash
   curl https://your-render-url.onrender.com/mcp/tools
   ```

3. **Check OpenAPI Schema**:
   ```bash
   curl https://your-render-url.onrender.com/.well-known/openapi.json
   ```

## Important Notes

- **Never commit `.env` file** to Git
- **Service Role Key** is sensitive - keep it secure
- **API_BASE_URL** must match your Render service URL exactly
- After first deployment, update `API_BASE_URL` to your Render URL

