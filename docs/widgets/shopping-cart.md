# Phase 1.2: Shopping Cart Widget

## Overview

**Widget Purpose**: Display cart contents with quantity controls and checkout action
**Display Mode**: `pip` (picture-in-picture) for persistent visibility
**Primary CTAs**: "Update Quantity", "Remove Item", "Proceed to Checkout" (max 3 actions)
**Tool(s) Required**: `get_cart_summary` (hypothetical - returns cart items from session/state)

## MCP Tool Definition

```javascript
// tools/supercommerce-api/get-cart-summary.js

const executeFunction = async (params) => {
  // In production, this would fetch cart from session/database
  // For this implementation, we'll use widget state
  return {
    success: true,
    cart: {
      items: [], // Will be populated from widget state
      total: 0
    }
  };
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_cart_summary',
      description: 'View shopping cart with quantity controls and checkout option',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/cart-summary.html',
      'openai/toolInvocation/invoking': '🛒 Loading your cart...',
      'openai/toolInvocation/invoked': '✅ Cart loaded'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/cart-summary.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="cart-summary-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/cart-summary.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/cart-summary.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface WidgetStateType {
  cart: CartState;
}

// Custom hook for widget state (persistent < 4k tokens)
function useWidgetState<T>(defaultState: T): [T, (newState: T) => void] {
  const [widgetState, setWidgetState] = useState<T>(() => {
    return (window as any).openai?.widgetState || defaultState;
  });

  const updateWidgetState = useCallback((newState: T) => {
    setWidgetState(newState);
    (window as any).openai?.setWidgetState(newState);
  }, []);

  return [widgetState, updateWidgetState];
}

function CartSummary() {
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: { items: [], total: 0 }
  });

  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = widgetState.cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    if (newTotal !== widgetState.cart.total) {
      updateWidgetState({
        cart: { ...widgetState.cart, total: newTotal }
      });
    }
  }, [widgetState.cart.items]);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = widgetState.cart.items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    updateWidgetState({
      cart: { ...widgetState.cart, items: updatedItems }
    });
  };

  const removeItem = (itemId: number) => {
    const updatedItems = widgetState.cart.items.filter(item => item.id !== itemId);
    updateWidgetState({
      cart: { ...widgetState.cart, items: updatedItems }
    });
  };

  const handleCheckout = () => {
    // Send message to trigger checkout flow
    (window as any).openai?.sendMessage('Proceed to checkout');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (!widgetState.cart.items || widgetState.cart.items.length === 0) {
    return (
      <>
        <style>{`
          .cart-empty {
            padding: 32px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .cart-empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .cart-empty-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .cart-empty-subtitle {
            font-size: 14px;
            color: #6b7280;
          }
        `}</style>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <div className="cart-empty-title">Your cart is empty</div>
          <div className="cart-empty-subtitle">Add products to get started</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .cart-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
          overflow: hidden;
        }
        .cart-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .cart-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .cart-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        .cart-items {
          max-height: 400px;
          overflow-y: auto;
        }
        .cart-item {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          background: #f3f4f6;
          flex-shrink: 0;
        }
        .item-details {
          flex: 1;
          min-width: 0;
        }
        .item-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-price {
          font-size: 14px;
          color: #667eea;
          font-weight: 600;
        }
        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 4px;
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: white;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .qty-btn:hover {
          background: #667eea;
          color: white;
        }
        .qty-display {
          min-width: 32px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 12px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .remove-btn:hover {
          background: #fee2e2;
        }
        .item-subtotal {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }
        .cart-footer {
          padding: 20px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .total-label {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .total-amount {
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
        }
        .checkout-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .checkout-btn:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <p className="cart-subtitle">
            {widgetState.cart.items.length} {widgetState.cart.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-items">
          {widgetState.cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || `https://via.placeholder.com/60?text=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="item-image"
              />
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">{formatPrice(item.price)} each</div>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
                <div className="item-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatPrice(widgetState.cart.total)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('cart-summary-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<CartSummary />);
}
```

## Test Scenarios

### Scenario 1: View Empty Cart
**User**: "Show my cart"
**Action**: Claude calls `get_cart_summary`
**Result**: Widget displays empty cart message with icon

### Scenario 2: View Cart with Items
**User**: "Show my cart"
**Context**: Cart has 3 items from previous product additions
**Result**: Widget displays all items with quantities and total

### Scenario 3: Update Quantity
**User**: Clicks + button on item
**Result**: Quantity increments, subtotal updates, total recalculates

### Scenario 4: Remove Item
**User**: Clicks "Remove" on item
**Result**: Item removed from cart, total updates

### Scenario 5: Proceed to Checkout
**User**: Clicks "Proceed to Checkout"
**Result**: Widget sends message triggering checkout flow

## Integration Points

1. **Product Grid → Shopping Cart**:
   - When user clicks "Add to Cart" in product grid, product is added to `widgetState.cart`
   - Cart icon badge shows item count

2. **Shopping Cart → Checkout**:
   - `handleCheckout()` sends message to Claude
   - Claude calls `create_order_checkout` tool with cart data
   - Checkout widget loads with cart items pre-populated

3. **State Persistence**:
   - Cart state persists in `window.openai.widgetState`
   - Survives widget remounts and conversation context
   - Max 4k tokens (approximately 50-100 cart items)

## Widget State Schema

```typescript
{
  cart: {
    items: [
      {
        id: number,           // Product variant ID
        name: string,         // Product name
        price: number,        // Unit price
        quantity: number,     // Quantity in cart
        image?: string        // Product image URL
      }
    ],
    total: number            // Calculated total
  }
}
```

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/cart-summary.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/cart-summary.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Status

✅ **Complete** - Ready for production implementation
