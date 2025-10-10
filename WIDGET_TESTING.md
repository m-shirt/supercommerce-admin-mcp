# Widget Resource Testing Guide

## Overview
This guide shows how to test the widget resource system in your MCP server.

## Prerequisites
- Local HTTP server running: `npm run start:http` (port 3001)
- Widget assets built: `npm run build:widgets`

## Test Methods

### 1. Using curl (Local)

#### List all widget resources:
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list"
  }'
```

**Expected response:** Array of 2 widget resources (product-creation, order-list)

#### Read a specific widget:
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {
      "uri": "ui://widget/product-creation.html"
    }
  }'
```

**Expected response:** HTML widget template with script/style tags

### 2. Using MCP Inspector

#### Start the inspector:
```bash
npx @modelcontextprotocol/inspector http://localhost:3001/mcp
```

This will open a browser at: `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...`

#### In the inspector:
1. Navigate to the **Resources** tab
2. See 2 resources listed:
   - `ui://widget/product-creation.html`
   - `ui://widget/order-list.html`
3. Click on each to view the widget HTML content

### 3. Testing Production (Vercel)

#### List resources from Vercel:
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list"
  }'
```

#### Read widget from Vercel:
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {
      "uri": "ui://widget/product-creation.html"
    }
  }'
```

## Widget System Architecture

### Current Implementation
The MCP server uses the **static resource discovery system** located in:

- **Resource Registry**: `resources/paths.js` - Lists all widget resource files
- **Discovery Module**: `lib/resources.js` - Dynamically imports and loads resources
- **Widget Definitions**: `resources/widgets/*.js` - Individual widget resource files

### Widget Resource Structure
Each widget in `resources/widgets/` exports a `widgetResource` object:

```javascript
const widgetResource = {
  uri: "ui://widget/product-creation.html",
  name: "product-creation",
  description: "Interactive product creation widget",
  mimeType: "text/html+skybridge",
  html: `<div id="product-creation-root"></div>...`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-creation.html",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};
```

### Build System
- **Build Script**: `build-widgets.mts` - Compiles React widgets with Vite
- **Widget Source**: `src/widgets/*/index.jsx` - React components
- **Output**: `public/assets/*.js` and `*.css` files with content hashes
- **Registry**: `widget-registry.json` - Generated file mapping widgets to assets

## Verifying Widget Assets

### Check built assets:
```bash
ls -la public/assets/
```

Should show:
- `product-creation-[hash].js`
- `product-creation-[hash].css`
- `order-list-[hash].js`
- `order-list-[hash].css`

### Check widget registry:
```bash
cat assets/widget-registry.json
```

Should show widgets array with name, templateUri, html, js, and css fields.

## Troubleshooting

### Resources return empty array
- Check that `resources: {}` capability is enabled in Server initialization
- Verify `resources/paths.js` lists the widget files
- Check that widget files exist in `resources/widgets/`

### Widget HTML shows placeholder URLs
- Update `resources/widgets/*.js` files with actual Vercel URLs
- Or integrate with `lib/widgets.js` to use widget-registry.json

### Assets not loading in browser
- Verify assets are in `public/assets/` directory
- Check Vercel deployment includes the assets
- Verify asset URLs in widget HTML match deployed files

## Next Steps

To fully integrate the dynamic widget system:
1. Update `mcpServer.js` to use `lib/resources.js` instead of `lib/widgets.js`
2. Have widget resources load from `widget-registry.json`
3. This will auto-sync widget HTML with built asset hashes
