#!/bin/bash

# Script to push InsightFlow to GitHub
# Usage: ./push-to-github.sh [repository-name] [github-username]

REPO_NAME=${1:-"insightflow"}
GITHUB_USER=${2:-""}

echo "🚀 Pushing InsightFlow to GitHub"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
  echo "✅ Remote 'origin' already exists"
  REMOTE_URL=$(git remote get-url origin)
  echo "   Current remote: $REMOTE_URL"
  echo ""
  read -p "Do you want to use the existing remote? (y/n): " USE_EXISTING
  if [ "$USE_EXISTING" != "y" ]; then
    echo "Removing existing remote..."
    git remote remove origin
  else
    echo "Pushing to existing remote..."
    git branch -M main
    git push -u origin main
    exit 0
  fi
fi

# Get GitHub username if not provided
if [ -z "$GITHUB_USER" ]; then
  read -p "Enter your GitHub username: " GITHUB_USER
fi

echo ""
echo "Repository name: $REPO_NAME"
echo "GitHub username: $GITHUB_USER"
echo ""

# Check if repository exists on GitHub
echo "Checking if repository exists..."
if curl -s -o /dev/null -w "%{http_code}" "https://github.com/$GITHUB_USER/$REPO_NAME" | grep -q "200"; then
  echo "✅ Repository already exists on GitHub"
else
  echo "⚠️  Repository does not exist on GitHub yet"
  echo ""
  echo "Please create the repository first:"
  echo "1. Go to: https://github.com/new"
  echo "2. Repository name: $REPO_NAME"
  echo "3. Description: InsightFlow - Project Management Platform with MCP Server"
  echo "4. Choose Public or Private"
  echo "5. DO NOT initialize with README, .gitignore, or license"
  echo "6. Click 'Create repository'"
  echo ""
  read -p "Press Enter after you've created the repository..."
fi

# Add remote
echo ""
echo "Adding remote..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Set branch to main
git branch -M main

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "📍 Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
else
  echo ""
  echo "❌ Failed to push. Please check:"
  echo "   - Repository exists on GitHub"
  echo "   - You have push access"
  echo "   - Your GitHub credentials are configured"
fi

