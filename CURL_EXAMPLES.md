# MCP Curl Request Examples

Complete reference for testing your Supercommerce MCP server with curl.

## Base URL

```
https://supercommerce-admin-mcp.vercel.app/api/mcp
```

## Required Headers

```bash
-H "Content-Type: application/json"
-H "Accept: application/json, text/event-stream"
```

---

## 🎨 Widget Resources

### List All Widget Resources

Lists all available widget templates.

```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list",
    "params": {}
  }'
```

**Response:**
```json
{
  "result": {
    "resources": [
      {
        "uri": "ui://widget/product-creation.html",
        "name": "product-creation",
        "description": "product-creation widget template",
        "mimeType": "text/html+skybridge",
        "_meta": {
          "openai/outputTemplate": "ui://widget/product-creation.html",
          "openai/toolInvocation/invoking": "Creating product creation...",
          "openai/toolInvocation/invoked": "product creation created successfully",
          "openai/widgetAccessible": true,
          "openai/resultCanProduceWidget": true
        }
      },
      {
        "uri": "ui://widget/order-list.html",
        "name": "order-list",
        "description": "order-list widget template",
        "mimeType": "text/html+skybridge",
        "_meta": {...}
      }
    ]
  }
}
```

### Read Specific Widget Resource

Get the HTML content of a specific widget.

**Product Creation Widget:**
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

**Order List Widget:**
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "ui://widget/order-list.html"
    }
  }'
```

**Response:**
```json
{
  "result": {
    "contents": [
      {
        "uri": "ui://widget/product-creation.html",
        "mimeType": "text/html+skybridge",
        "text": "<div id=\"product-creation-root\"></div>\n<link rel=\"stylesheet\" href=\"https://...\">\n<script type=\"module\" src=\"https://...\"></script>",
        "_meta": {...}
      }
    ]
  }
}
```

---

## 🔧 Tools

### List All Tools

Get all 130 available e-commerce tools.

```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/list",
    "params": {}
  }'
```

**Response:** (showing first tool)
```json
{
  "result": {
    "tools": [
      {
        "name": "create_main_product",
        "description": "Create Main Product",
        "inputSchema": {
          "type": "object",
          "properties": {
            "brand_id": {"type": "string", "description": "The brand id"},
            "category_id": {"type": "string", "description": "The category id"},
            ...
          }
        }
      },
      ...
    ]
  }
}
```

### Call a Tool

Execute a specific tool with parameters.

**List Inventories:**
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "list_inventories",
      "arguments": {}
    }
  }'
```

**List Orders:**
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "list_orders",
      "arguments": {
        "per_page": "10"
      }
    }
  }'
```

**Create Product (with widget!):**
```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "create_main_product",
      "arguments": {
        "name": "Test Product",
        "sku": "TEST-001",
        "type": "variant"
      }
    }
  }'
```

---

## 📚 Prompts

### List All Prompts

```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 8,
    "method": "prompts/list",
    "params": {}
  }'
```

### Get a Prompt

```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "prompts/get",
    "params": {
      "name": "Product Creation"
    }
  }'
```

---

## 🧪 Testing Scripts

### Quick Test All Endpoints

```bash
./test-mcp-widgets.sh
```

### Test Vercel Deployment

```bash
./test-vercel.sh
```

---

## 📊 Response Format

All responses use **Server-Sent Events (SSE)** format:

```
event: message
data: {"result": {...}, "jsonrpc": "2.0", "id": 1}
```

To parse with jq:
```bash
curl ... | grep "^data:" | sed 's/^data: //' | jq
```

---

## 🔍 Debugging

### Check Server Status

```bash
curl -s https://supercommerce-admin-mcp.vercel.app/api/mcp
```

**Expected:** HTTP 406 error (correct - needs proper headers)

### Check Widget Assets

```bash
curl -s https://supercommerce-admin-mcp.vercel.app/assets/widget-registry.json | jq
```

**Expected:** JSON with widget definitions

---

## 💡 Common Use Cases

### 1. Get Available Tools for a Category

```bash
curl -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | grep -o '"name":"[^"]*"' | head -20
```

### 2. Check Which Tools Have Widgets

Look for tools with `_meta` containing `openai/outputTemplate`:
- `create_main_product` → product-creation widget
- `list_orders` → order-list widget

### 3. Test Widget Rendering

1. Call `resources/list` to get widget URIs
2. Call `resources/read` with URI to get HTML
3. The HTML contains links to CSS and JS assets

---

## 🎯 Tips

1. **Use `-s` flag** to suppress progress output
2. **Pipe to `jq`** for pretty JSON formatting
3. **Save to file** with `-o output.json`
4. **Include line numbers** with `jq` using `grep -n`

**Example with jq:**
```bash
curl -s -X POST https://supercommerce-admin-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"resources/list","params":{}}' \
  | grep "^data:" | sed 's/^data: //' | jq '.result.resources'
```

---

**Last Updated:** 2025-10-10
**Server:** https://supercommerce-admin-mcp.vercel.app/api/mcp
