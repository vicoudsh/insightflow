# Push to GitHub

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `insightflow` (or your preferred name)
3. Description: "InsightFlow - Project Management Platform with MCP Server"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have files)
6. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create insightflow --public --description "InsightFlow - Project Management Platform with MCP Server" --source=. --remote=origin --push
```

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you the commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/insightflow.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/insightflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify

Check that your code is on GitHub:
- Visit: https://github.com/YOUR_USERNAME/insightflow
- Verify all files are present

## Important Notes

- `.env` files are excluded via `.gitignore` (sensitive credentials)
- Make sure to set up environment variables in your deployment environment
- Update production URLs in configuration files after deployment

