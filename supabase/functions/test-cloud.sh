#!/bin/bash

# Test edge functions deployed to Supabase cloud
# No Docker needed!

FUNCTION_NAME=${1:-hello-world}
PROJECT_REF=$(cat supabase/.temp/project-ref 2>/dev/null || echo "")

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project not linked. Run: supabase link --project-ref YOUR_PROJECT_REF"
  exit 1
fi

# Load .env if it exists
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

REMOTE_URL="https://${PROJECT_REF}.supabase.co/functions/v1/${FUNCTION_NAME}"

if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "⚠️  SUPABASE_ANON_KEY not found in .env"
  echo ""
  echo "Please add it to your .env file:"
  echo "  SUPABASE_ANON_KEY=your_anon_key_here"
  echo ""
  echo "Get your key from: https://app.supabase.com/project/$PROJECT_REF/settings/api"
  exit 1
fi

echo "🌐 Testing CLOUD function: ${FUNCTION_NAME}"
echo "📍 URL: ${REMOTE_URL}"
echo ""

# Test the function
curl -i --location --request POST "${REMOTE_URL}" \
  --header "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  --header "Content-Type: application/json" \
  --data '{"name":"InsightFlow Cloud Test"}'

echo ""
echo ""
echo "✅ Test complete!"

