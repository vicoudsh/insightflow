#!/bin/bash

# Script to test MCP server connection on Render
# Usage: ./test-mcp-connection.sh [your-render-url]

RENDER_URL=${1:-"https://insightflow-h2mw.onrender.com"}

echo "=================================="
echo "Testing MCP Server on Render"
echo "=================================="
echo "URL: $RENDER_URL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$RENDER_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed"
    echo "   Response: $BODY"
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 2: Tools Discovery
echo "2. Testing MCP Tools Discovery..."
TOOLS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$RENDER_URL/mcp/tools")
HTTP_CODE=$(echo "$TOOLS_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$TOOLS_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Tools discovery successful"
    TOOL_COUNT=$(echo "$BODY" | grep -o '"name"' | wc -l)
    echo "   Found $TOOL_COUNT tools"
else
    echo "❌ Tools discovery failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 3: OpenAPI Schema
echo "3. Testing OpenAPI Schema..."
OPENAPI_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$RENDER_URL/.well-known/openapi.json")
HTTP_CODE=$(echo "$OPENAPI_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$OPENAPI_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OpenAPI schema accessible"
    SCHEMA_VERSION=$(echo "$BODY" | grep -o '"openapi":"[^"]*"' | cut -d: -f2 | tr -d '"')
    echo "   OpenAPI version: $SCHEMA_VERSION"
else
    echo "❌ OpenAPI schema failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 4: Plugin Manifest
echo "4. Testing Plugin Manifest..."
PLUGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$RENDER_URL/.well-known/ai-plugin.json")
HTTP_CODE=$(echo "$PLUGIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$PLUGIN_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Plugin manifest accessible"
    API_URL=$(echo "$BODY" | grep -o '"url":"[^"]*"' | head -1 | cut -d: -f2- | tr -d '"')
    echo "   API URL: $API_URL"
else
    echo "❌ Plugin manifest failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 5: MCP Tool Execution (List Projects)
echo "5. Testing MCP Tool Execution (List Projects)..."
LIST_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -X POST "$RENDER_URL/mcp/projects/list" \
    -H "Content-Type: application/json" \
    -d '{"page": 1, "limit": 10}')
HTTP_CODE=$(echo "$LIST_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$LIST_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ MCP tool execution successful"
    SUCCESS=$(echo "$BODY" | grep -o '"success":[^,}]*' | cut -d: -f2)
    echo "   Success: $SUCCESS"
else
    echo "❌ MCP tool execution failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

echo "=================================="
echo "Test Complete"
echo "=================================="

