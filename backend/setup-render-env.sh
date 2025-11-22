#!/bin/bash

# Script to extract environment variables from .env file
# and format them for Render.com deployment

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found in current directory"
    exit 1
fi

echo "=================================="
echo "Environment Variables for Render"
echo "=================================="
echo ""
echo "Copy these to Render Dashboard → Environment → Add Environment Variable"
echo ""
echo "----------------------------------"
echo ""

# Extract non-comment, non-empty lines and format for Render
cat "$ENV_FILE" | grep -v "^#" | grep -v "^$" | while IFS='=' read -r key value; do
    # Skip if key is empty
    if [ -z "$key" ]; then
        continue
    fi
    
    # Remove leading/trailing whitespace from key
    key=$(echo "$key" | xargs)
    
    # For security, mask sensitive values
    if [[ "$key" == *"KEY"* ]] || [[ "$key" == *"SECRET"* ]] || [[ "$key" == *"PASSWORD"* ]]; then
        echo "Key: $key"
        echo "Value: [HIDDEN - Copy from your .env file]"
    else
        # Remove quotes from value if present
        value=$(echo "$value" | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//")
        echo "Key: $key"
        echo "Value: $value"
    fi
    echo ""
done

echo "=================================="
echo "All Environment Variables Listed"
echo "=================================="
echo ""
echo "To copy all variables at once, run:"
echo "  cat $ENV_FILE | grep -v '^#' | grep -v '^$'"
echo ""

