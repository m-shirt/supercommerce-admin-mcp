# Widget Architecture Overview

**Quick Reference Guide for Supercommerce Widget Implementations**

---

## 📍 Where Am I?

You have **two widget systems** in this repository:

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR CURRENT STATE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Working: Standalone Web App (/app, /widgets routes)        │
│     - Uses AppState + APIClient                                 │
│     - Tab-based navigation                                      │
│     - Good for development/testing                              │
│                                                                  │
│  📋 Documented: OpenAI Apps SDK Integration                     │
│     - Uses window.openai API                                    │
│     - Conversational flow in ChatGPT                           │
│     - Ready to implement                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Documentation Navigation

### 🚀 Quick Start Paths

**Path 1: I want to test the existing standalone app**
1. Run `npm run dev`
2. Open http://localhost:3000/app
3. Browse products, add to cart, create orders

**Path 2: I want to view/test widgets**
1. Run `npm run dev`
2. Open http://localhost:3000/widgets
3. Connect to MCP server
4. Select and preview widgets

**Path 3: I want to integrate with ChatGPT/Claude Desktop**
1. Read **[docs/MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** ⭐ START HERE
2. Follow migration steps for each widget
3. Build widgets with OpenAI Apps SDK hooks
4. Test in ChatGPT

**Path 4: I want to understand the architecture**
1. Read **[WIDGET_IMPLEMENTATIONS.md](../WIDGET_IMPLEMENTATIONS.md)** - Overview
2. Read **[IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)** - Detailed architecture
3. Browse **[docs/widgets/](./widgets/)** - Individual widget specs

---

## 📂 File Structure Map

```
supercommerce-mcp/
│
├── 📄 IMPLEMENTATION_PLAN.md          ← Architecture + Product Grid reference
├── 📄 WIDGET_IMPLEMENTATIONS.md       ← Widget catalog + navigation
├── 📄 CLAUDE.md                       ← Project context for AI assistants
│
├── 📁 docs/
│   ├── 📄 MIGRATION_GUIDE.md         ← ⭐ How to adapt widgets to OpenAI SDK
│   ├── 📄 WIDGET_ARCHITECTURE_OVERVIEW.md  ← This file
│   └── 📁 widgets/
│       ├── 📄 README.md              ← Widget directory guide
│       ├── 📄 shopping-cart.md       ← Shopping Cart spec
│       ├── 📄 checkout.md            ← Checkout spec
│       ├── 📄 order-confirmation.md  ← Order Confirmation spec
│       ├── 📄 order-list.md          ← Order List spec
│       ├── 📄 order-details.md       ← Order Details spec
│       └── 📄 product-edit.md        ← Product Edit spec
│
├── 📁 pages/
│   ├── 📄 app.js                     ← Standalone web app (WORKING)
│   └── 📄 widgets.js                 ← Widget viewer/tester (WORKING)
│
├── 📁 lib/
│   ├── 📄 resources.js               ← MCP resource registration
│   └── 📁 widget-jsx/
│       ├── 📄 product-grid.jsx       ← Standalone Product Grid (WORKING)
│       ├── 📄 shopping-cart.jsx      ← Standalone Shopping Cart (WORKING)
│       ├── 📄 checkout-form.jsx      ← Standalone Checkout (WORKING)
│       ├── 📄 order-list.jsx         ← Standalone Order List (WORKING)
│       └── ... (other widgets)
│
├── 📁 public/
│   └── 📁 lib/
│       ├── 📄 app-state.js           ← Global state manager (standalone)
│       └── 📄 api-client.js          ← API wrapper (standalone)
│
├── 📁 widgets/                       ← 🚧 TO BE CREATED (OpenAI Apps SDK)
│   ├── 📁 src/
│   │   ├── 📄 product-grid.tsx       ← OpenAI SDK version
│   │   ├── 📄 shopping-cart.tsx      ← OpenAI SDK version
│   │   └── ... (migrated widgets)
│   ├── 📁 hooks/
│   │   ├── 📄 useOpenAiGlobal.ts     ← OpenAI SDK hook
│   │   └── 📄 useWidgetState.ts      ← Widget state hook
│   ├── 📄 build.js                   ← Build script (esbuild)
│   └── 📄 package.json               ← Widget dependencies
│
└── 📁 tools/
    └── 📁 supercommerce-api/
        ├── 📄 get-product-list.js    ← MCP tool (needs _meta for OpenAI SDK)
        └── ... (130 MCP tools)
```

---

## 🎯 Key Concepts

### Standalone App (Current Implementation)
```javascript
// State Management
window.AppState.setProducts(products);
window.AppState.addToCart(product, 1);
window.AppState.navigateTo('checkout');

// API Calls
const result = await window.APIClient.getProducts({ limit: 50 });

// Navigation
<button onClick={() => setActiveView('cart')}>Go to Cart</button>
```

### OpenAI Apps SDK (Target Implementation)
```javascript
// State Management
const [state, setState] = useWidgetState({ products: [] });
setState({ products: newProducts });

// API Calls (via MCP tools)
const result = await openai.callTool('get_product_list', { limit: 50 });

// Navigation (conversational)
await openai.sendMessage('I want to checkout');
// Or trigger tool that returns another widget
await openai.callTool('create_order_checkout', { cartItems });
```

---

## 📊 Widget Comparison Table

| Widget | Standalone (lib/widget-jsx/) | OpenAI SDK (widgets/src/) | Status |
|--------|------------------------------|---------------------------|--------|
| **Product Grid** | ✅ product-grid.jsx | 📋 product-grid.tsx | Standalone working |
| **Shopping Cart** | ✅ shopping-cart.jsx | 📋 shopping-cart.tsx | Standalone working |
| **Checkout** | ✅ checkout-form.jsx | 📋 checkout-simple.tsx | Standalone working |
| **Order List** | ✅ order-list.jsx | 📋 order-list.tsx | Standalone working |
| **Order Details** | ❌ Not implemented | 📋 order-details.tsx | Documented only |
| **Order Confirmation** | ❌ Not implemented | 📋 order-confirmation.tsx | Documented only |
| **Product Edit** | ❌ Not implemented | 📋 product-edit.tsx | Documented only |

---

## 🔄 Migration Strategy

### Phase 1: Setup (30 minutes)
- [ ] Create `widgets/` directory structure
- [ ] Install dependencies (React, TypeScript, esbuild)
- [ ] Create custom hooks (`useOpenAiGlobal`, `useWidgetState`)
- [ ] Setup build script

### Phase 2: Migrate Core Widgets (2-3 hours per widget)
- [ ] Product Grid → `widgets/src/product-grid.tsx`
- [ ] Shopping Cart → `widgets/src/shopping-cart.tsx`
- [ ] Checkout → `widgets/src/checkout-simple.tsx`
- [ ] Order List → `widgets/src/order-list.tsx`

### Phase 3: Build New Widgets (2-3 hours per widget)
- [ ] Order Details → `widgets/src/order-details.tsx`
- [ ] Order Confirmation → `widgets/src/order-confirmation.tsx`
- [ ] Product Edit → `widgets/src/product-edit.tsx`

### Phase 4: Testing (1 day)
- [ ] Test in widget viewer
- [ ] Test with ChatGPT
- [ ] Test with Claude Desktop

---

## 🎨 Design Principles

### Standalone App Principles
- **Multi-view SPA**: Tab-based navigation
- **Shared state**: Global AppState
- **Direct API calls**: Via APIClient
- **Complex workflows**: Multi-step wizards OK
- **Use case**: Internal admin dashboard

### OpenAI Apps SDK Principles
- **Conversational**: Linear flow in chat
- **Isolated state**: Per-widget (< 4k tokens)
- **Tool-based API**: Via `openai.callTool()`
- **Simple actions**: Max 2-3 CTAs per widget
- **Use case**: End-user ChatGPT experience

---

## 📚 Learning Resources

### For Understanding Current Implementation
1. **Run the app**: `npm run dev` → http://localhost:3000/app
2. **Read source**: `lib/widget-jsx/product-grid.jsx`
3. **Inspect state**: `public/lib/app-state.js`

### For Implementing OpenAI Apps SDK
1. **Read migration guide**: [`docs/MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md)
2. **Study architecture**: [`IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)
3. **Check widget specs**: [`docs/widgets/`](./widgets/)
4. **Official docs**: [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)

---

## 🆘 Common Questions

### Q: Which implementation should I use?
**A:** Depends on your use case:
- **Standalone app** (`/app`): For internal testing, development, admin dashboard
- **OpenAI Apps SDK**: For ChatGPT integration, conversational e-commerce

### Q: Can I use both?
**A:** Yes! They serve different purposes and can coexist. The standalone app is great for development/testing, while OpenAI SDK is for production ChatGPT integration.

### Q: Do I need to migrate everything?
**A:** No. You can:
- Keep standalone app as-is for testing
- Migrate widgets one by one to OpenAI SDK
- Run both in parallel

### Q: Which widgets are working right now?
**A:**
- ✅ **Standalone**: Product Grid, Shopping Cart, Checkout, Order List (via `/app`)
- 📋 **OpenAI SDK**: All 7 widgets documented but not yet implemented

### Q: Where do I start?
**A:** Follow this order:
1. Test standalone app: http://localhost:3000/app
2. Read migration guide: [`docs/MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md)
3. Migrate one widget (start with Product Grid)
4. Build and test
5. Repeat for other widgets

---

## 🎯 Next Steps

### If you want to test what's working now:
```bash
npm run dev
open http://localhost:3000/app
# Browse products, add to cart, create orders
```

### If you want to implement ChatGPT integration:
1. Read **[docs/MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**
2. Follow migration steps
3. Test with ChatGPT

### If you want to understand the system:
1. Read **[WIDGET_IMPLEMENTATIONS.md](../WIDGET_IMPLEMENTATIONS.md)**
2. Read **[IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)**
3. Browse **[docs/widgets/](./widgets/)**

---

**Last Updated**: 2025-10-11
**Status**: Documentation complete, OpenAI SDK implementation ready to start
**Maintainer**: Supercommerce Team
