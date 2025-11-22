#!/bin/bash

# MCP Handler Edge Function Testing Script
# 
# Usage:
#   ./test.sh [local|remote]
# 
# If "local" is specified, tests against local Supabase instance
# If "remote" is specified, tests against deployed Supabase instance
# Default: local

ENV=${1:-local}

if [ "$ENV" = "local" ]; then
  BASE_URL="http://localhost:54321/functions/v1/mcp-handler"
  echo "🧪 Testing LOCAL Supabase instance"
  echo "📍 Base URL: $BASE_URL"
  echo ""
else
  # Your Supabase project URL
  BASE_URL="https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler"
  echo "🌐 Testing REMOTE Supabase instance"
  echo "📍 Base URL: $BASE_URL"
  echo ""
fi

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print test header
print_test() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}Test:${NC} $1"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to print success
print_success() {
  echo -e "${GREEN}✅ Success${NC}"
}

# Function to print error
print_error() {
  echo -e "${RED}❌ Error${NC}"
}

# Get access token (you'll need to set this manually)
if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${YELLOW}⚠️  ACCESS_TOKEN environment variable not set${NC}"
  echo -e "${YELLOW}   To get your token:${NC}"
  echo -e "${YELLOW}   1. Login to your app and get the Supabase access token from browser console${NC}"
  echo -e "${YELLOW}   2. Or use: ${NC}supabase auth token"
  echo -e "${YELLOW}   3. Export it: ${NC}export ACCESS_TOKEN='your_token_here'"
  echo ""
  read -p "Enter your access token (or press Enter to skip authenticated tests): " TOKEN
  ACCESS_TOKEN=$TOKEN
fi

echo ""

# Test 1: Tools Discovery (Public, No Auth)
print_test "1. Tools Discovery (GET /tools)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/tools")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  print_success
  echo "Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  print_error
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 2: List Projects (Requires Auth)
if [ -n "$ACCESS_TOKEN" ]; then
  print_test "2. List Projects (POST /projects/list)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "tool": "projects/list",
      "page": 1,
      "limit": 10
    }')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    print_error
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
else
  echo -e "${YELLOW}⏭️  Skipping authenticated tests (no token)${NC}"
  echo ""
fi

# Test 3: Create Project (Requires Auth)
if [ -n "$ACCESS_TOKEN" ]; then
  print_test "3. Create Project (POST /projects/create)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "tool": "projects/create",
      "name": "Test Project from MCP",
      "description": "Created via MCP Handler Edge Function",
      "status": "active"
    }')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    
    # Extract project ID for next tests
    PROJECT_ID=$(echo "$BODY" | jq -r '.result.id' 2>/dev/null)
    if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
      echo ""
      echo "Created Project ID: $PROJECT_ID"
      export PROJECT_ID
    fi
  else
    print_error
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
fi

# Test 4: Get Project (Requires Auth)
if [ -n "$ACCESS_TOKEN" ] && [ -n "$PROJECT_ID" ]; then
  print_test "4. Get Project (POST /projects/get)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"tool\": \"projects/get\",
      \"project_id\": \"$PROJECT_ID\"
    }")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    print_error
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
fi

# Test 5: Error Handling - Invalid Tool
if [ -n "$ACCESS_TOKEN" ]; then
  print_test "5. Error Handling - Invalid Tool"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "tool": "invalid/tool"
    }')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "400" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    print_error
    echo "Expected HTTP 400, got: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
fi

# Test 6: Error Handling - Missing Auth
print_test "6. Error Handling - Missing Auth"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "projects/list"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  print_success
  echo "Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  print_error
  echo "Expected HTTP 401, got: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 7: List Stacks (Requires Auth)
if [ -n "$ACCESS_TOKEN" ] && [ -n "$PROJECT_ID" ]; then
  print_test "7. List Stacks (POST /stacks/list)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"tool\": \"stacks/list\",
      \"project_id\": \"$PROJECT_ID\",
      \"page\": 1,
      \"limit\": 10
    }")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    print_error
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
fi

# Test 8: List Roadmaps (Requires Auth)
if [ -n "$ACCESS_TOKEN" ] && [ -n "$PROJECT_ID" ]; then
  print_test "8. List Roadmaps (POST /roadmaps/list)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"tool\": \"roadmaps/list\",
      \"project_id\": \"$PROJECT_ID\",
      \"page\": 1,
      \"limit\": 10
    }")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_success
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    print_error
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
  echo ""
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

