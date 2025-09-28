# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Model Context Protocol (MCP) server** for the Supercommerce e-commerce platform, originally generated using the Postman MCP Generator. It provides **130 API tools (100% coverage)** for comprehensive management of products, orders, customers, inventory, geographic data, prescriptions, marketing, notifications, and all e-commerce operations through various transport modes (STDIO, HTTP, SSE).

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
- `npx @modelcontextprotocol/inspector node mcpServer.js` - Run official MCP inspector (STDIO mode)
- `npx @modelcontextprotocol/inspector http://localhost:3001/api/mcp` - Run official MCP inspector (HTTP mode)

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

### 🔍 Tool Validation System

**IMPORTANT:** This repository has comprehensive validation to prevent tool registration errors.

- **All PRs** are automatically validated for tool syntax and duplicates
- **Auto-fix workflows** test builds before creating PRs
- **Staging promotions** validate before auto-merging
- **Postman sync** validates before creating PRs

**Validation includes:**
- Duplicate tool detection
- Syntax validation of paths.js
- Tool definition validation
- Build testing
- MCP server startup testing

See `.github/TOOL_VALIDATION.md` for complete details.

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

## 🎉 Complete API Coverage (130/130 Tools)

**Historic Achievement: 100% API coverage completed across 17 phases**

### Core Business Operations
- **Product Management**: create-main-product, create-variant-product, update-product, delete-option, delete-brand
- **Order Management**: create-order, edit-order, list-orders, view-order, list-order-status
- **Customer Management**: create-customer, list-customers, view-customer, activate/deactivate-customer
- **Inventory**: list-inventories, get-product-details, list-products-for-create-order

### Advanced Business Features
- **Geographic Management**: get-governorates, create-governorate, get-areas, create-area (11 APIs)
- **Medical Prescriptions**: get-prescription-reasons, change-prescription-status, export-prescriptions (3 APIs)
- **Marketing & Promotions**: get-promotions, create-promo-code, activate/deactivate-promo-code (7 APIs)
- **Push Notifications**: get-notifications, send-notification, delete-notification (3 APIs)
- **Content Management**: get-pages, create-page, update-terms/privacy/about/cookies-page (8 APIs)
- **Financial Operations**: get-transactions, export-transactions (2 APIs)
- **Delivery Management**: get-delivery-managers, create-delivery-manager, get-pickups (9 APIs)

### Administrative & Support
- **Groups Management**: get-groups-list, create-group, activate/deactivate-group (7 APIs)
- **Custom Lists**: get-custom-lists, create-custom-list, edit-custom-list (7 APIs)
- **Store Front**: get-sections, create-section, get-custom-ads, manage-ads (12 APIs)
- **Branch Management**: get-branches, create-branch, activate/deactivate-branch (7 APIs)
- **Campaign Management**: get-campaigns, create-campaign, update-campaign (5 APIs)
- **Contact & Support**: get-contact-us, export-contact-us (2 APIs)
- **Menu System**: get-menu, update-menu, generate-menu (3 APIs)
- **Authentication**: admin-login (1 API)
- **Utility**: upload-image, list-cities, list-payment-methods, list-cancellation-reasons

## Product Creation Workflow

Products require two-step creation:
1. **Main Product**: Use `create_main_product` with basic info and SKU format `main_{sku}`
2. **Variant Product**: Use `create_variant_product` with detailed info, pricing, and inventory

Required data gathering before product creation:
- `list-inventories` - Get inventory location IDs
- `list-customer-groups` - Get customer group IDs for pricing
- `get-all-brands-list-dropdown` - Brand selection
- `get-all-category-dropdown` - Category selection