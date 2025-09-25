# 🚀 SuperCommerce MCP Tools Server

A comprehensive Model Context Protocol (MCP) server providing **192+ tools** for complete control over the SuperCommerce Admin API. This server enables AI assistants like Claude to manage e-commerce operations including products, orders, customers, inventory, and more.

[![MCP Version](https://img.shields.io/badge/MCP-1.0-blue)](https://modelcontextprotocol.io/)
[![Tools](https://img.shields.io/badge/Tools-192+-green)]()
[![API Coverage](https://img.shields.io/badge/API%20Coverage-100%25-success)]()
[![Auto Sync](https://img.shields.io/badge/Auto%20Sync-Enabled-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Available Tools](#-available-tools)
- [Tool Documentation](#-tool-documentation)
- [Automation](#-automation)
- [Development](#-development)
- [Changelog](#-changelog)

## ✨ Features

- **192+ MCP Tools**: Complete coverage of SuperCommerce Admin API
- **100% API Coverage**: Every endpoint is accessible through MCP
- **Automatic Synchronization**: Tools auto-update with Postman collection changes
- **Type-Safe Parameters**: Full JSON Schema validation
- **Comprehensive Error Handling**: Meaningful error messages and recovery
- **Secure Authentication**: Bearer token authentication with environment variables
- **Backup System**: Automatic timestamped backups for all updates
- **Multiple Transport Modes**: STDIO, HTTP, and SSE support
- **Built-in Inspector**: Web UI for testing and debugging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (v20+ recommended)
- npm (included with Node.js)
- SuperCommerce API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/m-shirt/supercommerce-admin-mcp.git
cd supercommerce-admin-mcp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Configuration

Update `.env` with your credentials:

```env
# SuperCommerce API
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=your-jwt-token-here

# Optional: Postman Integration
POSTMAN_API_KEY=your-postman-api-key
```

### Usage with Claude Desktop

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "supercommerce": {
      "command": "node",
      "args": ["/absolute/path/to/supercommerce-mcp/mcpServer.js"],
      "env": {
        "SUPERCOMMERCE_BASE_URL": "https://storeapi.el-dokan.com",
        "SUPERCOMMERCE_API_API_KEY": "your-jwt-token"
      }
    }
  }
}
```

## 📚 Available Tools

### Tool Categories Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **Product Management** | 8 | Products, variants, images |
| **Categories** | 5 | Categories and subcategories |
| **Orders** | 6 | Order lifecycle management |
| **Customers** | 8 | Customer accounts and addresses |
| **Inventory** | 3 | Stock and inventory tracking |
| **Promotions** | 12 | Discounts, campaigns, rewards |
| **Delivery** | 16 | Shipping, areas, branches |
| **Content** | 14 | CMS, ads, sliders, pages |
| **Reports** | 8 | Analytics and exports |
| **Settings** | 10 | Configuration and policies |
| **Groups** | 7 | Customer groups management |
| **Custom Lists** | 7 | Dynamic content lists |
| **Notifications** | 3 | Push notifications |
| **Authentication** | 2 | Login and password reset |
| **Utilities** | 35 | Dropdowns, lookups, helpers |

### Featured Tools

#### 🛍️ Product Management
- `create_main_product` - Create new products with full details
- `update_main_product` - Modify existing products
- `create_variant_product` - Add product variations
- `get_product_list` - Search and filter products
- `upload_image` - Upload product images

#### 📦 Order Processing
- `create_order` - Place new orders programmatically
- `edit_order_status` - Update order workflow status
- `view_order` - Get complete order details
- `list_orders` - Filter and search orders

#### 👥 Customer Management
- `create_customer` - Register new customers
- `edit_customer` - Update customer profiles
- `create_address` - Add delivery addresses
- `activate_customer` / `deactivate_customer` - Account management

#### 🎁 Marketing & Promotions
- `create_promo_code` - Generate discount codes
- `create_campaign` - Launch marketing campaigns
- `get_rewards` - Manage loyalty programs
- `push_notification` - Send push notifications

## 📖 Tool Documentation

Each tool includes:
- **Description**: What the tool does
- **Parameters**: Required and optional inputs with types
- **Returns**: Response format and data
- **Examples**: Sample usage patterns
- **Error Codes**: Common errors and solutions

### Example Tool Documentation

#### `create_order`
Creates a new order in the system.

**Parameters:**
- `customer_id` (string, required): Customer placing the order
- `items` (array, required): Array of product items
- `delivery_address_id` (string, required): Delivery address
- `payment_method` (string, optional): Payment type
- `notes` (string, optional): Order notes

**Returns:**
```json
{
  "order_id": "ORD-123456",
  "status": "pending",
  "total": 150.00,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Example Usage:**
```javascript
await create_order({
  customer_id: "CUST-789",
  items: [
    { product_id: "PROD-123", quantity: 2 }
  ],
  delivery_address_id: "ADDR-456"
});
```

[View complete tool documentation →](docs/TOOLS.md)

## 🔄 Automation

### Automatic Synchronization

The project automatically syncs with Postman collections:

1. **GitHub Actions** - Runs daily and on collection updates
2. **Postman Webhooks** - Real-time sync on API changes
3. **Manual Generation** - On-demand tool updates

### Workflow Features

- ✅ **Smart Detection** - Automatically detects new and updated APIs
- ✅ **Type Safety** - Generates MCP tools with proper JSON Schema validation
- ✅ **Safe Updates** - Creates timestamped backups before any changes
- ✅ **Documentation Sync** - Updates README, TOOLS.md, and CHANGELOG.md
- ✅ **Business Model Categorization** - Organizes tools by e-commerce domains
- ✅ **Build Validation** - Tests compilation and syntax correctness
- ✅ **Version Control** - Commits changes with detailed commit messages
- ✅ **Zero Downtime** - No service interruption during updates

### Sync Status

| Component | Status | Last Updated |
|-----------|--------|------------- |
| MCP Tools | ✅ Active | Auto-synced with Postman |
| Documentation | ✅ Active | Generated on every update |
| Changelog | ✅ Active | Automated entries with timestamps |
| README | ✅ Active | Tool counts updated automatically |
| Build Status | ✅ Passing | Validated on every change |

### Manual Commands

```bash
# Generate/update all tools
npm run generate-tools

# Only create new tools (skip updates)
npm run generate-tools:skip-updates

# Validate all tools
npm run validate

# View tool list
npm run list-tools
```

## 🧪 Development

### Running the Server

```bash
# Standard I/O (for Claude Desktop)
npm run start:stdio

# HTTP mode with streaming
npm run start:http

# Server-Sent Events
npm run start:sse

# Development with hot reload
npm run dev
```

### Testing Tools

```bash
# Use MCP Inspector
npx @modelcontextprotocol/inspector node mcpServer.js

# Or use the built-in UI
npm run dev
# Open http://localhost:3000
```

### Project Structure

```
supercommerce-mcp/
├── tools/                    # MCP tool implementations
│   ├── supercommerce-api/   # 144+ generated tools
│   ├── backups/             # Timestamped backups
│   └── paths.js             # Tool registry
├── scripts/                  # Automation scripts
│   ├── generate-tools-from-postman.js
│   └── generate-docs.js
├── docs/                     # Documentation
│   ├── TOOLS.md            # Complete tool reference
│   ├── AUTOMATION.md       # Automation guide
│   └── CHANGELOG.md        # Version history
├── postman/                  # API collections
├── lib/                      # Core libraries
└── pages/                    # Web UI
```

## 📝 Changelog

Latest changes and updates are tracked automatically:

### [2025-09-25] Latest Update
- 🔄 Updated 1 existing tools
- 🔧 Fixed reset password URL generation bug
- 🛠️ Tools auto-synced from Postman collection

[View full changelog →](CHANGELOG.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-tool`)
3. Make your changes
4. Run validation (`npm run validate`)
5. Commit changes (`git commit -m 'Add amazing tool'`)
6. Push to branch (`git push origin feature/amazing-tool`)
7. Open a Pull Request

### Development Guidelines

- Follow existing tool patterns
- Include proper error handling
- Add parameter validation
- Update documentation
- Test with MCP Inspector

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/m-shirt/supercommerce-admin-mcp/issues)
- **Discord**: Join `#mcp-lab` in [Postman Discord](https://discord.gg/PQAWcPkprM)
- **Documentation**: [Full Docs](docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by [SuperCommerce API](https://storeapi.el-dokan.com)
- Automated with [Postman](https://www.postman.com/)
- AI Integration via [Claude](https://claude.ai)

---

*Generated and maintained by automated workflows • Last sync: 2025-09-25 16:08:00 UTC*