# Render.com Deployment Guide

## Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub
2. **Render Account**: Sign up at https://render.com
3. **Environment Variables**: Set up your environment variables on Render

## Step 1: Create a Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`vicoudsh/insightflow`)
4. Configure the service:
   - **Name**: `insightflow-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if you want to deploy only backend)

## Step 2: Set Environment Variables on Render

Go to your Render service → **Environment** → **Add Environment Variable**

Add the following variables from your `.env` file:

### Required Environment Variables

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Server URL (Update this after deployment to your Render URL)
API_BASE_URL=https://insightflow-h2mw.onrender.com

# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
```

## Step 3: Get Your Environment Variables

To extract your environment variables from your `.env` file, run:

```bash
cd backend
cat .env | grep -v "^#" | grep -v "^$"
```

This will show all your environment variables. Copy each one and add it to Render.

## Step 4: After Deployment

1. **Update API_BASE_URL**: Once your service is deployed, Render will provide a URL (e.g., `https://insightflow-h2mw.onrender.com`). Update the `API_BASE_URL` environment variable to match.

2. **Verify Deployment**: 
   ```bash
   curl https://your-render-url.onrender.com/health
   ```

3. **Test MCP Tools**:
   ```bash
   curl https://your-render-url.onrender.com/mcp/tools
   ```

## Quick Setup Script

You can also set environment variables via Render CLI (if you have it installed):

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Set environment variables
render env:set SUPABASE_URL=your-value --service your-service-name
render env:set SUPABASE_ANON_KEY=your-value --service your-service-name
render env:set SUPABASE_SERVICE_ROLE_KEY=your-value --service your-service-name
render env:set API_BASE_URL=https://your-render-url.onrender.com --service your-service-name
```

## Important Notes

1. **Service Role Key**: Keep `SUPABASE_SERVICE_ROLE_KEY` secret - never commit it to Git
2. **API_BASE_URL**: Must match your Render service URL exactly
3. **CORS_ORIGIN**: Update to match your frontend domain
4. **Health Check**: Render automatically checks `/health` endpoint

## Troubleshooting

### Service won't start
- Check build logs on Render dashboard
- Verify all environment variables are set
- Check that `SUPABASE_SERVICE_ROLE_KEY` is configured

### MCP tools return 401
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check server logs on Render dashboard
- Ensure service role key has correct permissions

### API calls fail
- Verify `API_BASE_URL` matches your Render URL
- Check CORS configuration matches your frontend domain
- Review server logs for detailed error messages

