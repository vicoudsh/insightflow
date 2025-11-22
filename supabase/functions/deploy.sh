#!/bin/bash

# Deploy edge functions to Supabase cloud
# No Docker needed!

set -e

FUNCTION_NAME=${1:-""}

# Get project info
PROJECT_REF=$(cat supabase/.temp/project-ref 2>/dev/null || echo "")

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project not linked. Run: supabase link --project-ref YOUR_PROJECT_REF"
  exit 1
fi

echo "🚀 Deploying edge functions to Supabase cloud"
echo "📦 Project: $PROJECT_REF"
echo ""

if [ -z "$FUNCTION_NAME" ]; then
  echo "Deploying ALL functions..."
  supabase functions deploy
else
  echo "Deploying function: $FUNCTION_NAME"
  supabase functions deploy "$FUNCTION_NAME"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test your function:"
echo "  ./supabase/functions/test-cloud.sh $FUNCTION_NAME"
echo ""
echo "Or test manually:"
echo "  curl -i --location --request POST 'https://${PROJECT_REF}.supabase.co/functions/v1/${FUNCTION_NAME}' \\"
echo "    --header 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "    --header 'Content-Type: application/json' \\"
echo "    --data '{\"name\":\"Test\"}'"

