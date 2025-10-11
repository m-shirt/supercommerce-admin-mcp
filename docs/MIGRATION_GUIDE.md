# OpenAI Apps SDK Widget Implementation Guide

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: Complete Implementation Guide

---

## 📋 Overview

This guide provides step-by-step instructions for implementing OpenAI Apps SDK widgets for ChatGPT/Claude Desktop integration with the Supercommerce MCP server.

### Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ OpenAI Apps SDK (ChatGPT/Claude Desktop Integration)       │
├─────────────────────────────────────────────────────────────┤
│ ChatGPT/Claude → MCP Server → Tools → Widgets              │
│ - Conversational flow                                       │
│ - Tool calls via window.openai.callTool()                  │
│ - Widget state via window.openai.widgetState              │
│ - Skybridge HTML resources                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Implementation Patterns

### 1. State Management

#### Widget State Pattern
```javascript
// widgets/src/product-grid.tsx
import { useWidgetState, useOpenAiGlobal } from './hooks';

function ProductGrid() {
  const openai = useOpenAiGlobal();
  const [state, setState] = useWidgetState({
    products: [],
    searchQuery: ''
  });

  // Get state
  const products = state.products;

  // Update state
  setState({ products: newProducts });

  // State is automatically persisted (< 4k tokens)
}
```

### 2. API Calls via MCP Tools
```javascript
// Call MCP tool via OpenAI SDK
const result = await openai.callTool('get_product_list', {
  keyword_or_sku: search,
  limit: 50
});
const products = result?.data?.products || [];
```

### 3. Navigation via Tool Calls
```javascript
// Send message to ChatGPT to trigger next action
await openai.sendMessage('I want to proceed to checkout');

// Or call another tool that returns widget
await openai.callTool('create_order_checkout', { cartItems });
```

### 4. Cart Operations via Widget State
```javascript
// Cart state stored in widget state
const [state, setState] = useWidgetState({
  cart: { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 }
});

// Add to cart (update local state)
setState({
  cart: {
    ...state.cart,
    items: [...state.cart.items, { ...product, quantity }]
  }
});

// Call tool to persist/sync cart
await openai.callTool('update_cart', { items: state.cart.items });
```

---

## 📦 Widget-by-Widget Implementation

### Widget 1: Product Grid

**Target File**: `widgets/src/product-grid.tsx`

**Implementation Steps**:

1. **Create Custom Hooks** (`widgets/hooks/useOpenAiGlobal.ts`):
```typescript
import { useEffect, useState } from 'react';

export function useOpenAiGlobal() {
  const [openai, setOpenai] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).openai) {
      setOpenai((window as any).openai);
    }
  }, []);

  return openai;
}
```

2. **Create Widget State Hook** (`widgets/hooks/useWidgetState.ts`):
```typescript
import { useState, useEffect } from 'react';
import { useOpenAiGlobal } from './useOpenAiGlobal';

export function useWidgetState<T>(initialState: T) {
  const openai = useOpenAiGlobal();
  const [state, setStateInternal] = useState<T>(initialState);

  // Load persisted state on mount
  useEffect(() => {
    if (openai?.widgetState) {
      const savedState = openai.widgetState.get();
      if (savedState) {
        setStateInternal({ ...initialState, ...savedState });
      }
    }
  }, [openai]);

  // Persist state on change
  const setState = (updates: Partial<T>) => {
    const newState = { ...state, ...updates };
    setStateInternal(newState);

    if (openai?.widgetState) {
      openai.widgetState.set(newState);
    }
  };

  return [state, setState] as const;
}
```

3. **Migrate Product Grid** (`widgets/src/product-grid.tsx`):
```typescript
import React from 'react';
import { useWidgetState, useOpenAiGlobal } from '../hooks';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  category?: string;
  sku?: string;
}

interface ProductGridState {
  products: Product[];
  searchQuery: string;
  selectedProduct: Product | null;
}

export function ProductGrid() {
  const openai = useOpenAiGlobal();
  const [state, setState] = useWidgetState<ProductGridState>({
    products: [],
    searchQuery: '',
    selectedProduct: null
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch products using MCP tool
  const fetchProducts = React.useCallback(async (search = '') => {
    if (!openai) return;

    setLoading(true);
    setError(null);

    try {
      const result = await openai.callTool('get_product_list', {
        keyword_or_sku: search,
        limit: 50
      });

      const rawProducts = result?.data?.products || [];
      const productList = rawProducts.map((product: any) => ({
        id: product.id,
        name: product.product_name || product.name,
        price: product.price || 0,
        stock: product.stock || 0,
        image: product.image || product.images?.[0] || null,
        category: product.category,
        sku: product.sku
      }));

      setState({ products: productList });
    } catch (err) {
      setError((err as Error).message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [openai, setState]);

  // Load products on mount
  React.useEffect(() => {
    if (openai && state.products.length === 0) {
      fetchProducts('');
    }
  }, [openai]);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (state.searchQuery) {
        fetchProducts(state.searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state.searchQuery]);

  const handleProductClick = (product: Product) => {
    setState({ selectedProduct: product });
  };

  const handleAddToCart = async (product: Product) => {
    if (!openai) return;

    // Add to cart via tool call
    await openai.callTool('add_to_cart', {
      productId: product.id,
      quantity: 1
    });

    // Send success message
    await openai.sendMessage(`Added ${product.name} to cart!`);

    setState({ selectedProduct: null });
  };

  // ... rest of component (JSX remains mostly the same)
}
```

4. **Update MCP Tool Definition** (`tools/supercommerce-api/get-product-list.js`):
```javascript
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_product_list',
      description: 'Browse products with search and filtering',
      parameters: {
        type: 'object',
        properties: {
          keyword_or_sku: {
            type: 'string',
            description: 'Search by product name or SKU'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of products to return',
            default: 50
          }
        }
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/product-grid.html',
      'openai/toolInvocation/invoking': '🔍 Loading products...',
      'openai/toolInvocation/invoked': '✅ Products loaded'
    }
  }
};
```

5. **Create Skybridge HTML Resource** (`lib/resources.js`):
```javascript
export function getResourceByUri(uri, resources) {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  if (uri === 'ui://widget/product-grid.html') {
    return {
      uri: uri,
      mimeType: 'text/html+skybridge',
      text: `
<div id="product-grid-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/product-grid.js"></script>
      `.trim()
    };
  }
  // ... other widgets
}
```

---

### Widget 2: Shopping Cart

**Target File**: `widgets/src/shopping-cart.tsx`

**Implementation**:

```typescript
// widgets/src/shopping-cart.tsx
import React from 'react';
import { useWidgetState, useOpenAiGlobal } from '../hooks';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function ShoppingCart() {
  const openai = useOpenAiGlobal();
  const [state, setState] = useWidgetState<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });

  const updateQuantity = (itemId: number, newQuantity: number) => {
    const updatedItems = state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );

    recalculateCart(updatedItems);
  };

  const removeItem = (itemId: number) => {
    const updatedItems = state.items.filter(item => item.id !== itemId);
    recalculateCart(updatedItems);
  };

  const recalculateCart = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = items.length > 0 ? 15.00 : 0;
    const total = subtotal + tax + shipping;

    setState({ items, subtotal, tax, shipping, total });
  };

  const handleCheckout = async () => {
    if (!openai) return;

    // Call checkout tool which returns checkout widget
    await openai.callTool('create_order_checkout', {
      cartItems: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      total: state.total
    });
  };

  // ... JSX remains mostly the same
}
```

---

### Widget 3: Checkout Form

**Target File**: `widgets/src/checkout-simple.tsx`

**Implementation**:

```typescript
// widgets/src/checkout-simple.tsx
import React from 'react';
import { useWidgetState, useOpenAiGlobal } from '../hooks';

interface CheckoutState {
  customerId: string;
  paymentMethodId: string;
  cityId: string;
  cartItems: any[];
  subtotal: number;
}

export function CheckoutSimple() {
  const openai = useOpenAiGlobal();
  const [state, setState] = useWidgetState<CheckoutState>({
    customerId: '',
    paymentMethodId: '',
    cityId: '',
    cartItems: [],
    subtotal: 0
  });

  const [customers, setCustomers] = React.useState([]);
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load dropdown data
  React.useEffect(() => {
    if (!openai) return;

    Promise.all([
      openai.callTool('list_customers', { limit: 100 }),
      openai.callTool('list_payment_methods', {}),
      openai.callTool('list_cities', {})
    ]).then(([customersRes, paymentsRes, citiesRes]) => {
      setCustomers(customersRes?.data?.customers || []);
      setPaymentMethods(paymentsRes?.data?.payment_methods || []);
      setCities(citiesRes?.data?.cities || []);
    });
  }, [openai]);

  const handlePlaceOrder = async () => {
    if (!openai) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare order items
      const orderItems = state.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Call create_order tool
      const result = await openai.callTool('create_order', {
        customer_id: state.customerId,
        payment_method_id: state.paymentMethodId,
        city_id: state.cityId,
        items: orderItems,
        notes: 'Order placed via widget'
      });

      const orderId = result?.data?.order?.id || result?.order_id;

      // Show order confirmation widget
      await openai.callTool('view_order_confirmation', {
        orderId: orderId
      });

      // Clear cart
      setState({ cartItems: [], subtotal: 0 });
    } catch (err) {
      setError((err as Error).message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Simple single-screen checkout form
  return (
    <div className="checkout-simple">
      {/* Customer Selection */}
      <select
        value={state.customerId}
        onChange={(e) => setState({ customerId: e.target.value })}
      >
        <option value="">Select Customer</option>
        {customers.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Payment Method */}
      <select
        value={state.paymentMethodId}
        onChange={(e) => setState({ paymentMethodId: e.target.value })}
      >
        <option value="">Select Payment Method</option>
        {paymentMethods.map((p: any) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* City/Delivery */}
      <select
        value={state.cityId}
        onChange={(e) => setState({ cityId: e.target.value })}
      >
        <option value="">Select City</option>
        {cities.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Order Summary */}
      <div className="order-summary">
        <p>Subtotal: ${state.subtotal.toFixed(2)}</p>
        <p>Items: {state.cartItems.length}</p>
      </div>

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={!state.customerId || !state.paymentMethodId || !state.cityId || loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
```

---

### Widget 4: Order List

**Target File**: `widgets/src/order-list.tsx`

**Implementation**:

```typescript
// widgets/src/order-list.tsx
import React from 'react';
import { useWidgetState, useOpenAiGlobal } from '../hooks';

interface Order {
  id: string;
  customer: string;
  total: number;
  items: number;
  status: string;
  date: string;
}

interface OrderListState {
  orders: Order[];
  statusFilter: string;
}

export function OrderList() {
  const openai = useOpenAiGlobal();
  const [state, setState] = useWidgetState<OrderListState>({
    orders: [],
    statusFilter: 'all'
  });

  const [loading, setLoading] = React.useState(false);

  const fetchOrders = React.useCallback(async (status = 'all') => {
    if (!openai) return;

    setLoading(true);

    try {
      let toolName = 'list_orders';
      if (status === 'placed') toolName = 'list_placed_orders';
      if (status === 'delivered') toolName = 'list_delivered_orders';
      if (status === 'cancelled') toolName = 'list_cancelled_orders';

      const result = await openai.callTool(toolName, { limit: 50 });
      const orderList = result?.data?.orders || [];

      setState({ orders: orderList, statusFilter: status });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [openai, setState]);

  React.useEffect(() => {
    fetchOrders(state.statusFilter);
  }, [state.statusFilter]);

  const handleOrderClick = async (order: Order) => {
    if (!openai) return;

    // Call tool to show order details widget
    await openai.callTool('view_order', {
      orderId: order.id
    });
  };

  // ... JSX remains mostly the same
}
```

---

## 🔧 Build System Setup

### 1. Install Dependencies

```bash
cd widgets
npm init -y
npm install react react-dom
npm install -D @types/react @types/react-dom typescript esbuild
```

### 2. Create Build Script

**File**: `widgets/build.js`

```javascript
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, '../public/widgets');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Get all widget files
const widgets = fs.readdirSync(srcDir)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

console.log(`Building ${widgets.length} widgets...`);

widgets.forEach(async (widget) => {
  const widgetName = widget.replace(/\.(tsx|jsx)$/, '');

  try {
    await esbuild.build({
      entryPoints: [path.join(srcDir, widget)],
      bundle: true,
      outfile: path.join(outDir, `${widgetName}.js`),
      format: 'esm',
      target: 'es2020',
      external: ['react', 'react-dom'],
      jsx: 'automatic',
      minify: true,
      sourcemap: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    console.log(`✓ Built ${widgetName}.js`);
  } catch (error) {
    console.error(`✗ Failed to build ${widgetName}:`, error);
  }
});
```

### 3. Add Build Scripts to package.json

```json
{
  "scripts": {
    "build": "node build.js",
    "watch": "node build.js --watch",
    "clean": "rm -rf ../public/widgets/*.js"
  }
}
```

### 4. Project Structure

```
supercommerce-mcp/
├── widgets/
│   ├── src/
│   │   ├── product-grid.tsx
│   │   ├── shopping-cart.tsx
│   │   ├── checkout-simple.tsx
│   │   ├── order-list.tsx
│   │   ├── order-details.tsx
│   │   ├── order-confirmation.tsx
│   │   └── product-edit.tsx
│   ├── hooks/
│   │   ├── useOpenAiGlobal.ts
│   │   └── useWidgetState.ts
│   ├── build.js
│   ├── package.json
│   └── tsconfig.json
├── public/
│   └── widgets/
│       ├── product-grid.js
│       ├── shopping-cart.js
│       └── ... (built files)
└── lib/
    └── resources.js (resource registration)
```

---

## 🧪 Testing Migration

### 1. Test in Widget Viewer

```bash
# Start dev server
npm run dev

# Open widget viewer
open http://localhost:3000/widgets
```

### 2. Test with ChatGPT

```bash
# Start MCP server in HTTP mode
npm run start:http

# In ChatGPT settings, add MCP server:
# http://localhost:3001/api/mcp
```

**Test Prompts**:
- "Show me products"
- "Show my shopping cart"
- "I want to checkout"
- "Show all my orders"

### 3. Test with Claude Desktop

```bash
# Start MCP server in STDIO mode
npm run start:stdio
```

**Claude Desktop config** (`claude_desktop_config.json`):
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

---

## 📊 Implementation Checklist

### Phase 1: Setup
- [ ] Create `widgets/` directory structure
- [ ] Install dependencies (React, TypeScript, esbuild)
- [ ] Create custom hooks (`useOpenAiGlobal`, `useWidgetState`)
- [ ] Setup build system (`build.js`)

### Phase 2: Implement Core Widgets
- [ ] Implement Product Grid
  - [ ] Build with `openai.callTool()`
  - [ ] Use widget state hook
  - [ ] Add `_meta` fields to MCP tool
  - [ ] Create Skybridge HTML resource
- [ ] Implement Shopping Cart
  - [ ] Cart operations with widget state
  - [ ] Navigation via tool calls
- [ ] Implement Checkout
  - [ ] Single-screen form
  - [ ] Tool-based order creation
- [ ] Implement Order List
  - [ ] Order fetching via tools
  - [ ] Details via tool call

### Phase 3: Testing
- [ ] Build all widgets (`npm run build`)
- [ ] Test in widget viewer
- [ ] Test with ChatGPT
- [ ] Test with Claude Desktop

### Phase 4: Documentation
- [ ] Update IMPLEMENTATION_PLAN.md
- [ ] Update WIDGET_IMPLEMENTATIONS.md
- [ ] Add usage examples

---

## 🎯 OpenAI Apps SDK Key Principles

| Aspect | Implementation |
|--------|---------------|
| **Entry Point** | MCP tool invocation from chat |
| **State** | Per-widget state (< 4k tokens) |
| **API Calls** | Via `openai.callTool()` to MCP tools |
| **Navigation** | Tool calls return new widgets |
| **Cart** | Widget state + optional sync tool |
| **Data Flow** | Isolated per widget instance |
| **Complexity** | Simple, 2-3 CTAs max |
| **User Context** | Conversational chat interface |

---

## 💡 Best Practices

### 1. Keep Widget State Small
```typescript
// ✅ Good: Only essential data
const [state, setState] = useWidgetState({
  selectedItems: [123, 456],
  filter: 'active'
});

// ❌ Bad: Storing large datasets
const [state, setState] = useWidgetState({
  allProducts: [...1000 products...], // Too large!
  images: {...} // Store URLs, not binary data
});
```

### 2. Use Tool Calls for Data
```typescript
// ✅ Good: Fetch on demand
const products = await openai.callTool('get_product_list', { limit: 50 });

// ❌ Bad: Storing in widget state
setState({ products: [...] }); // Will exceed 4k token limit
```

### 3. Simple, Focused Widgets
```typescript
// ✅ Good: Single purpose
function ProductGrid() {
  // Just browse products
}

// ❌ Bad: Too many features
function ProductManagement() {
  // Browse, edit, delete, create, filter, export, ...
}
```

### 4. Conversational Flow
```typescript
// ✅ Good: Linear flow
// 1. Browse products → 2. Add to cart → 3. Checkout → 4. Confirmation

// ❌ Bad: Complex navigation
// Dashboard with tabs, modals, nested views, breadcrumbs
```

---

## 🔗 Related Documentation

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Architecture overview
- [WIDGET_IMPLEMENTATIONS.md](../WIDGET_IMPLEMENTATIONS.md) - Widget catalog
- [docs/widgets/](./widgets/) - Individual widget documentation
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk) - Official docs
- [MCP Specification](https://modelcontextprotocol.io/) - Protocol docs

---

## 🆘 Troubleshooting

### Issue: `window.openai` is undefined

**Cause**: Widget loaded before OpenAI SDK initialized

**Solution**:
```typescript
const openai = useOpenAiGlobal();

if (!openai) {
  return <div>Loading...</div>;
}
```

### Issue: Widget state not persisting

**Cause**: State exceeds 4k token limit

**Solution**:
```typescript
// Store IDs, not full objects
setState({
  selectedProductIds: [1, 2, 3], // ✅
  // selectedProducts: [{...}, {...}] // ❌
});
```

### Issue: Tool call fails with "Tool not found"

**Cause**: MCP tool not registered or missing `_meta` field

**Solution**:
```javascript
// Ensure tool has _meta field
_meta: {
  'openai/outputTemplate': 'ui://widget/my-widget.html'
}
```

### Issue: Widget shows blank screen

**Cause**: Build error or missing dependencies

**Solution**:
```bash
# Check build output
npm run build

# Check browser console
# Open DevTools → Console
```

---

**Implementation Status**: Ready to Begin
**Estimated Time**: 2-3 days for all 7 widgets
**Complexity**: Medium (requires TypeScript and build setup)

For questions or issues, refer to the [OpenAI Apps SDK documentation](https://developers.openai.com/apps-sdk/concepts/design-guidelines).
