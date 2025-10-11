# Supercommerce MCP Server

**Model Context Protocol (MCP) server with 130 e-commerce API tools and interactive widget system**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io/)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)]()

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with web interface
npm run dev
# Open http://localhost:3000

# Start MCP server (STDIO mode for Claude Desktop)
npm run start:stdio

# Start MCP server (HTTP mode for web clients)
npm run start:http
```

---

## 📦 What's Inside

### 1. MCP Server (130 API Tools)
Complete API coverage for Supercommerce e-commerce platform:
- Products: create, edit, list, search (40+ tools)
- Orders: create, manage, track (25+ tools)
- Customers: manage accounts, groups (15+ tools)
- Inventory: track stock, locations (10+ tools)
- Geographic: governorates, areas, cities (15+ tools)
- Marketing: promotions, campaigns (10+ tools)
- And more: notifications, prescriptions, delivery, payments

### 2. OpenAI Apps SDK Widget System

**7 conversational e-commerce widgets** for ChatGPT/Claude Desktop integration:
- **Access**: Through ChatGPT interface after MCP server connection
- **Purpose**: Conversational e-commerce workflows
- **Features**:
  - Product Grid with search and filtering
  - Shopping Cart with quantity controls
  - Simple checkout form
  - Order list with status filters
  - Order details with status management
  - Order confirmation with animations
  - Product quick edit form
- **Technology**: OpenAI Apps SDK, MCP resources, Skybridge HTML, React 18+

---

## 📁 Project Structure

```
supercommerce-mcp/
├── pages/                    # Next.js pages
│   ├── index.js             # Web interface homepage
│   └── api/                 # API routes for MCP server
├── lib/
│   ├── resources.js         # MCP resource registration
│   └── tools.js             # Tool discovery system
├── widgets/                 # 🚧 OpenAI Apps SDK widgets (to be implemented)
│   ├── src/                # React widgets with OpenAI SDK hooks
│   │   ├── product-grid.tsx
│   │   ├── shopping-cart.tsx
│   │   ├── checkout-simple.tsx
│   │   ├── order-list.tsx
│   │   ├── order-details.tsx
│   │   ├── order-confirmation.tsx
│   │   └── product-edit.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useOpenAiGlobal.ts
│   │   └── useWidgetState.ts
│   ├── build.js            # esbuild configuration
│   └── package.json        # Widget dependencies
├── public/
│   └── widgets/            # Built widget bundles (output)
├── tools/
│   └── supercommerce-api/  # 130 MCP tool definitions
├── docs/
│   ├── MIGRATION_GUIDE.md          # Implementation guide
│   ├── WIDGET_ARCHITECTURE_OVERVIEW.md  # Quick reference guide
│   └── widgets/                     # Individual widget specs
│       ├── README.md
│       ├── shopping-cart.md
│       ├── checkout.md
│       └── ... (4 more)
├── IMPLEMENTATION_PLAN.md   # Architecture + Product Grid reference
├── WIDGET_IMPLEMENTATIONS.md # Widget catalog + navigation
└── mcpServer.js            # Main MCP server (STDIO/HTTP/SSE)
```

---

## 🎯 Use Cases

### 1. Widget Preview & Testing
```bash
npm run dev
open http://localhost:3000/widgets
```
- **Widget Inspector**: Preview OpenAI Apps SDK widgets before deployment
- Test with sample data
- View HTML source
- Debug widget rendering

### 2. Claude Desktop Integration
```bash
npm run start:stdio
```
Add to `claude_desktop_config.json`:
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

### 3. ChatGPT Integration
```bash
npm run start:http
```
- Connect ChatGPT to `http://localhost:3001/api/mcp`
- Use conversational e-commerce workflows
- Requires OpenAI Apps SDK widget implementation (see [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md))

---

## 📚 Documentation

### Quick Navigation

| I want to... | Read this... |
|--------------|-------------|
| **Implement OpenAI Apps SDK widgets** | [docs/MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) ⭐ |
| **Understand the architecture** | [WIDGET_IMPLEMENTATIONS.md](./WIDGET_IMPLEMENTATIONS.md) |
| **Get an overview** | [docs/WIDGET_ARCHITECTURE_OVERVIEW.md](./docs/WIDGET_ARCHITECTURE_OVERVIEW.md) |
| **See detailed widget specs** | [docs/widgets/](./docs/widgets/) |
| **Understand Product Grid** | [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) |
| **List all MCP tools** | Run `npm run list-tools` |

### Documentation Files

📄 **Main Documentation**
- [WIDGET_IMPLEMENTATIONS.md](./WIDGET_IMPLEMENTATIONS.md) - Complete widget catalog
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Architecture + Product Grid
- [CLAUDE.md](./CLAUDE.md) - Project context for AI assistants

📁 **docs/**
- [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) - OpenAI Apps SDK implementation guide
- [WIDGET_ARCHITECTURE_OVERVIEW.md](./docs/WIDGET_ARCHITECTURE_OVERVIEW.md) - Quick reference
- [widgets/](./docs/widgets/) - Individual widget specifications (7 widgets)

---

## 🛠️ Development Commands

### Core Development
```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build production Next.js app
npm run start        # Run production Next.js server
```

### MCP Server Modes
```bash
npm run start:stdio  # STDIO mode (Claude Desktop integration)
npm run start:http   # HTTP transport on port 3001
npm run start:sse    # Server-Sent Events transport
```

### Tool Management
```bash
npm run list-tools   # List all 130 available tools
node validateTools.js  # Validate tool JSON schemas

# MCP Inspector (official debugging tool)
npx @modelcontextprotocol/inspector node mcpServer.js  # STDIO mode
npx @modelcontextprotocol/inspector http://localhost:3001/api/mcp  # HTTP mode
```

---

## 🎨 OpenAI Apps SDK Architecture

```javascript
// Widget State: Per-widget state (< 4k tokens)
const [state, setState] = useWidgetState({
  products: [],
  selectedId: null
});

// API: Tool calls via OpenAI SDK
const result = await openai.callTool('get_product_list', { limit: 50 });

// Navigation: Conversational (via tool calls or messages)
await openai.callTool('view_order', { orderId: 123 });
await openai.sendMessage('Show my cart');
```

---

## 🧪 Testing

### Test Widget Inspector
```bash
npm run dev
open http://localhost:3000/widgets

# Connect to your MCP server
# Preview widgets with sample data
# Edit sample data to test different scenarios
```

### Test with Claude Desktop
```bash
npm run start:stdio

# In Claude Desktop, try:
# - "Show me products"
# - "List all orders"
# - "Create a new product"
```

---

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=<JWT_BEARER_TOKEN>
WIDGET_BASE_URL=http://localhost:3000/widgets
```

### Claude Desktop Config
`~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "supercommerce": {
      "command": "node",
      "args": ["/absolute/path/to/supercommerce-mcp/mcpServer.js"]
    }
  }
}
```

---

## 📊 Feature Status

### MCP Server
- ✅ 130 API tools (100% coverage)
- ✅ STDIO transport (Claude Desktop)
- ✅ HTTP transport (web clients)
- ✅ SSE transport (real-time)
- ✅ Tool validation
- ✅ Auto-discovery system

### OpenAI Apps SDK Widgets
- ✅ 7 widget specifications documented
- ✅ Architecture designed
- ✅ Implementation guide complete
- ✅ Custom hooks designed
- ✅ Widget Inspector for preview/testing
- 🚧 Implementation pending (see [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md))

---

## 🏗️ Adding New Tools

1. Create tool file in `tools/supercommerce-api/`:
```javascript
const executeFunction = async (params) => {
  // API call implementation
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'my_new_tool',
      description: 'Tool description',
      parameters: { /* JSON Schema */ }
    }
  }
};

export { apiTool };
```

2. Add to `tools/paths.js`:
```javascript
export const toolPaths = [
  // ...
  './tools/supercommerce-api/my-new-tool.js'
];
```

3. Validate: `node validateTools.js`

---

## 🎯 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] MCP server with 130 tools
- [x] STDIO/HTTP/SSE transports
- [x] Tool validation system

### Phase 2: Documentation ✅
- [x] Widget specifications (7 widgets)
- [x] Architecture documentation
- [x] Implementation guide

### Phase 3: OpenAI Apps SDK Implementation 📋
- [ ] Create `widgets/` directory structure
- [ ] Implement custom hooks (`useOpenAiGlobal`, `useWidgetState`)
- [ ] Build widgets with OpenAI SDK patterns
- [ ] Add `_meta` fields to MCP tools
- [ ] Build system (esbuild)

### Phase 4: Testing & Deployment 🚧
- [ ] Test widgets in ChatGPT
- [ ] Test widgets in Claude Desktop
- [ ] Production deployment
- [ ] Error handling & logging

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run validation: `node validateTools.js`
4. Test with MCP inspector or Claude Desktop
5. Submit pull request

### Code Style
- Use ESM modules
- Follow existing tool structure
- Add JSDoc comments
- Validate JSON schemas

---

## 📞 Support

- **Documentation**: See [docs/](./docs/) directory
- **Issues**: Check tool validation output
- **MCP Inspector**: Use official MCP debugging tool
- **Web Interface**: http://localhost:3000 for testing

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by [Supercommerce API](https://storeapi.el-dokan.com)
- Widget system inspired by [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)

---

**Version**: 3.0
**Last Updated**: 2025-10-11
**Status**: Production MCP server ready, OpenAI SDK widgets documented and ready for implementation

---

## 🚦 Quick Links

| Link | Description |
|------|-------------|
| [Widget Inspector](http://localhost:3000/widgets) | Preview & test widgets |
| [Web Interface](http://localhost:3000) | MCP tool explorer |
| [Implementation Guide](./docs/MIGRATION_GUIDE.md) | Build OpenAI Apps SDK widgets |
| [Architecture Overview](./docs/WIDGET_ARCHITECTURE_OVERVIEW.md) | System overview |
| [Widget Catalog](./WIDGET_IMPLEMENTATIONS.md) | All 7 widgets |
| [Widget Specs](./docs/widgets/) | Detailed specifications |

---

**Ready to start?**
1. Run `npm run dev` → Open http://localhost:3000/widgets to preview widgets
2. Run `npm run start:stdio` to connect with Claude Desktop
3. Or read [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) to implement widgets
