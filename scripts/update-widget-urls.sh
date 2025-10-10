#!/bin/bash

# Update Widget URLs for Production Deployment
# Usage: ./scripts/update-widget-urls.sh https://your-project.vercel.app

if [ -z "$1" ]; then
  echo "Error: Please provide your Vercel deployment URL"
  echo "Usage: ./scripts/update-widget-urls.sh https://your-project.vercel.app"
  exit 1
fi

VERCEL_URL=$1
ASSETS_URL="${VERCEL_URL}/assets"

echo "📝 Updating widget URLs to: ${ASSETS_URL}"

# Update build-widgets.mts
sed -i.bak "s|https://your-cdn.com/assets|${ASSETS_URL}|g" build-widgets.mts

echo "✅ Updated build-widgets.mts"

# Rebuild widgets
echo "🔨 Rebuilding widgets..."
npm run build:widgets

echo ""
echo "✅ Widget URLs updated successfully!"
echo ""
echo "Next steps:"
echo "1. Commit and push the changes:"
echo "   git add build-widgets.mts assets/"
echo "   git commit -m \"chore: update widget URLs for production\""
echo "   git push"
echo ""
echo "2. Wait for Vercel to redeploy"
echo "3. Connect to ChatGPT at: ${VERCEL_URL}/api/mcp"
