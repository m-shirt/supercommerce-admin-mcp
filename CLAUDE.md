# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Model Context Protocol (MCP) server** for the Supercommerce e-commerce platform, originally generated using the Postman MCP Generator. It provides 48+ API tools for managing products, orders, customers, inventory, and other e-commerce operations through various transport modes (STDIO, HTTP, SSE).

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server with web interface at http://localhost:3000
- `npm run build` - Build production Next.js application
- `npm run start` - Run production Next.js server

### MCP Server Modes
- `npm run start:stdio` - Run MCP server in STDIO mode (for Claude Desktop integration)
- `npm run start:http` - Run MCP server with HTTP transport on port 3001
- `npm run start:sse` - Run MCP server with Server-Sent Events transport

### Tool Management
- `npm run list-tools` - List all available tools and their parameters
- `node validateTools.js` - Validate all tool JSON schemas
- `npx @modelcontextprotocol/inspector node mcpServer.js` - Run official MCP inspector

## Architecture

### MCP Server Core (`mcpServer.js`)
The main server supports three transport modes from a single codebase:
- **STDIO**: Direct stdin/stdout for Claude Desktop integration
- **HTTP**: RESTful endpoints at `/mcp` for web clients
- **SSE**: Real-time bidirectional communication via `/sse` and `/messages`

### Tool Discovery System
Tools are auto-discovered through:
1. **Tool Registry**: `tools/paths.js` contains array of tool file paths
2. **Dynamic Loading**: `lib/tools.js` dynamically imports tools using ES6 modules
3. **Schema Validation**: Each tool exports `apiTool` object with function and MCP definition

### Tool Structure Pattern
All tools follow this consistent structure:
```javascript
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  // API call implementation
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'tool_name',
      description: 'Tool description',
      parameters: { /* JSON Schema */ }
    }
  }
};
export { apiTool };
```

### Prompt System
- **Prompt Registry**: `prompts/paths.js` defines available prompts
- **Dynamic Discovery**: `lib/prompts.js` handles prompt loading
- **Current Prompts**: `prompts/supercommerce/product-creation.js` provides comprehensive product creation workflow instructions

## Environment Configuration

Required environment variables in `.env`:
```
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=<JWT_BEARER_TOKEN>
```

## Adding New Tools

1. Create tool file in `tools/supercommerce-api/new-tool.js`
2. Follow the standard tool structure pattern above
3. Add file path to `tools/paths.js` export array
4. Run `node validateTools.js` to verify schema
5. Test using web interface at http://localhost:3000 or MCP inspector

## Web Interface

The Next.js application provides:
- **Tool Explorer**: Interactive testing interface for all tools
- **Parameter Forms**: Auto-generated forms based on JSON schemas
- **Response Viewer**: Formatted JSON output with syntax highlighting
- **Real-time Logs**: Connection status and operation logging
- **Cross-Origin Proxy**: `/api/proxy` for CORS-restricted requests

## Claude Desktop Integration

To connect with Claude Desktop:
1. Run `npm run start:stdio`
2. Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "supercommerce": {
      "command": "node",
      "args": ["/absolute/path/to/mcpServer.js"]
    }
  }
}
```

## Key API Tool Categories

- **Product Management**: create-main-product, create-variant-product, update-product
- **Order Management**: create-order, edit-order, list-orders
- **Customer Management**: create-customer, list-customers, view-customer
- **Inventory**: list-inventories (required for product creation)
- **Utility**: upload-image, list-cities, list-payment-methods

## Product Creation Workflow

Products require two-step creation:
1. **Main Product**: Use `create_main_product` with basic info and SKU format `main_{sku}`
2. **Variant Product**: Use `create_variant_product` with detailed info, pricing, and inventory

Required data gathering before product creation:
- `list-inventories` - Get inventory location IDs
- `list-customer-groups` - Get customer group IDs for pricing
- `get-all-brands-list-dropdown` - Brand selection
- `get-all-category-dropdown` - Category selection