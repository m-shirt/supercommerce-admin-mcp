#!/bin/bash

echo "🧪 Testing MCP Widget Resources"
echo "================================"
echo ""

# Test 1: List all resources (widgets)
echo "1️⃣  Listing Widget Resources..."
echo ""
curl -s -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list",
    "params": {}
  }' | grep -A 50 "resources" | head -60

echo ""
echo ""

# Test 2: Read a specific widget resource
echo "2️⃣  Reading Product Creation Widget..."
echo ""
curl -s -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {
      "uri": "ui://widget/product-creation.html"
    }
  }' | grep -A 20 "contents" | head -30

echo ""
echo ""

# Test 3: List all tools
echo "3️⃣  Listing First 5 Tools..."
echo ""
curl -s -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/list",
    "params": {}
  }' | grep -A 100 "tools" | head -40

echo ""
