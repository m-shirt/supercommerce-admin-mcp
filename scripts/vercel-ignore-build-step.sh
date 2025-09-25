#!/bin/bash

# Vercel Ignore Build Step
# This script determines whether Vercel should build and deploy
# Exit code 1 = Don't build, Exit code 0 = Build

echo "🔍 Checking if we should build and deploy..."

# Get the latest commit message
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "📝 Latest commit message: $COMMIT_MSG"

# Check if commit message starts with "chore:"
if [[ $COMMIT_MSG == chore:* ]]; then
    echo "✅ Chore commit detected - proceeding with build"
    exit 0
else
    echo "🚫 Non-chore commit detected - skipping build"
    exit 1
fi