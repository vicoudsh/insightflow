#!/bin/bash

# Quick test script for cloud deployment
# Usage: ./test-cloud.sh [anon_key] [user_token]

BASE_URL="https://yoxuhgzmxmrzxzrxrlky.supabase.co/functions/v1/mcp-handler"
ANON_KEY=${1:-""}
USER_TOKEN=${2:-""}

echo "🧪 Testing MCP Handler Edge Function (Cloud)"
echo "📍 Base URL: $BASE_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

if [ -z "$ANON_KEY" ]; then
  echo -e "${YELLOW}⚠️  ANON_KEY not provided as argument${NC}"
  echo -e "${YELLOW}   Usage: ./test-cloud.sh YOUR_ANON_KEY [USER_TOKEN]${NC}"
  echo -e "${YELLOW}   Get anon key from: https://supabase.com/dashboard/project/yoxuhgzmxmrzxzrxrlky/settings/api${NC}"
  echo ""
  read -p "Enter your anon key (or press Enter to skip): " ANON_KEY
fi

if [ -z "$ANON_KEY" ]; then
  echo -e "${RED}❌ Cannot proceed without anon key${NC}"
  exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 1: Tools Discovery (GET /tools)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/tools" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Success${NC}"
  TOOLS_COUNT=$(echo "$BODY" | jq '.tools | length' 2>/dev/null || echo "unknown")
  echo "Found $TOOLS_COUNT tools"
  echo ""
  echo "First few tools:"
  echo "$BODY" | jq '.tools[0:3]' 2>/dev/null || echo "$BODY" | head -20
else
  echo -e "${RED}❌ Error${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi

echo ""
echo ""

if [ -n "$USER_TOKEN" ]; then
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}Test 2: List Projects (POST / with user token)${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "apikey: $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "tool": "projects/list",
      "page": 1,
      "limit": 10
    }')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Success${NC}"
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  else
    echo -e "${RED}❌ Error${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
  fi
else
  echo -e "${YELLOW}⏭️  Skipping authenticated tests (no user token provided)${NC}"
  echo -e "${YELLOW}   To test authenticated endpoints, provide user token as second argument${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

