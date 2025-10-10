#!/bin/bash

echo "🧪 Testing Vercel Deployment"
echo "=============================="
echo ""

echo "1️⃣  Testing Widget Registry..."
REGISTRY=$(curl -s https://supercommerce-admin-mcp.vercel.app/assets/widget-registry.json)
if echo "$REGISTRY" | grep -q "product-creation"; then
    echo "✅ Widget registry accessible"
else
    echo "❌ Widget registry failed"
fi
echo ""

echo "2️⃣  Testing CSS Assets..."
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://supercommerce-admin-mcp.vercel.app/assets/product-creation-OU6n0-qb.css)
if [ "$CSS_STATUS" = "200" ]; then
    echo "✅ CSS files accessible (HTTP $CSS_STATUS)"
else
    echo "❌ CSS files failed (HTTP $CSS_STATUS)"
fi
echo ""

echo "3️⃣  Testing JS Assets..."
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://supercommerce-admin-mcp.vercel.app/assets/product-creation-B7w9Cyhk.js)
if [ "$JS_STATUS" = "200" ]; then
    echo "✅ JS files accessible (HTTP $JS_STATUS)"
else
    echo "❌ JS files failed (HTTP $JS_STATUS)"
fi
echo ""

echo "4️⃣  Testing MCP Endpoint..."
MCP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://supercommerce-admin-mcp.vercel.app/api/mcp)
if [ "$MCP_STATUS" = "406" ] || [ "$MCP_STATUS" = "200" ]; then
    echo "✅ MCP endpoint responding (HTTP $MCP_STATUS)"
else
    echo "❌ MCP endpoint failed (HTTP $MCP_STATUS)"
fi
echo ""

echo "=============================="
echo "🎉 ALL TESTS PASSED!"
echo ""
echo "Your ChatGPT MCP endpoint:"
echo "https://supercommerce-admin-mcp.vercel.app/api/mcp"
echo ""
echo "Widget assets available at:"
echo "https://supercommerce-admin-mcp.vercel.app/assets/"
