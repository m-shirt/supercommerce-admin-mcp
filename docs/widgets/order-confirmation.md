# Phase 2.2: Order Confirmation Widget

## Overview

**Widget Purpose**: Display order success with order details and next actions
**Display Mode**: `inline` for conversational flow
**Primary CTAs**: "View Order Details", "View All Orders", "Continue Shopping" (max 3 actions)
**Tool(s) Required**: None (receives order data as input)

## MCP Tool Definition

```javascript
// This widget is typically triggered after create_order, not by its own tool
// However, we can create a dedicated tool for viewing confirmation

// tools/supercommerce-api/view-order-confirmation.js

const executeFunction = async (params) => {
  // This tool receives order data from context or fetches it
  const { order_id } = params;

  // In practice, this might fetch order details or use passed data
  return {
    success: true,
    order: {
      id: order_id,
      // Other order details would be included here
    }
  };
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_order_confirmation',
      description: 'Show order confirmation with success message',
      parameters: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'Order ID to confirm'
          }
        },
        required: ['order_id']
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/order-confirmation.html',
      'openai/toolInvocation/invoking': '🎉 Preparing confirmation...',
      'openai/toolInvocation/invoked': '✅ Order confirmed'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/order-confirmation.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="order-confirmation-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/order-confirmation.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/order-confirmation.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface Order {
  id: string | number;
  customer?: {
    name: string;
    email: string;
  };
  total?: number;
  items?: Array<{
    name: string;
    quantity: number;
  }>;
  status?: string;
  created_at?: string;
}

function OrderConfirmation() {
  // Get order data from tool input
  const toolInput = (window as any).openai?.toolInput;
  const order: Order = toolInput?.data?.order || toolInput?.order || toolInput || {};

  const handleViewDetails = () => {
    (window as any).openai?.sendMessage(`Show order details for #${order.id}`);
  };

  const handleViewAllOrders = () => {
    (window as any).openai?.sendMessage('Show all my orders');
  };

  const handleContinueShopping = () => {
    (window as any).openai?.sendMessage('Show products');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .confirmation-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: scaleIn 0.5s ease-out;
        }

        .confirmation-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        .confirmation-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
          animation: fadeIn 0.6s ease-out 0.3s both;
        }

        .order-id-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 24px;
          animation: fadeIn 0.6s ease-out 0.4s both;
        }

        .order-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: left;
          animation: fadeIn 0.6s ease-out 0.5s both;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          color: #1f2937;
          font-weight: 600;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 16px 0;
        }

        .total-row {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeIn 0.6s ease-out 0.6s both;
        }

        .btn {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: scale(1.02);
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .btn-ghost {
          background: none;
          color: #6b7280;
          border: none;
          text-decoration: underline;
        }

        .btn-ghost:hover {
          color: #1f2937;
        }

        @media (max-width: 640px) {
          .confirmation-container {
            padding: 24px;
          }

          .confirmation-title {
            font-size: 24px;
          }

          .success-icon {
            font-size: 48px;
          }
        }
      `}</style>

      <div className="confirmation-container">
        <div className="success-icon">🎉</div>

        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">
          Your order has been received and is being processed
        </p>

        <div className="order-id-badge">Order #{order.id}</div>

        {(order.customer || order.total || order.items) && (
          <div className="order-summary">
            {order.customer && (
              <>
                <div className="summary-row">
                  <span className="summary-label">Customer</span>
                  <span className="summary-value">{order.customer.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{order.customer.email}</span>
                </div>
              </>
            )}

            {order.items && order.items.length > 0 && (
              <>
                <div className="divider" />
                {order.items.map((item, index) => (
                  <div key={index} className="summary-row">
                    <span className="summary-label">{item.name}</span>
                    <span className="summary-value">× {item.quantity}</span>
                  </div>
                ))}
              </>
            )}

            {order.total && (
              <>
                <div className="divider" />
                <div className="summary-row total-row">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">{formatPrice(order.total)}</span>
                </div>
              </>
            )}

            {order.status && (
              <>
                <div className="divider" />
                <div className="summary-row">
                  <span className="summary-label">Status</span>
                  <span className="summary-value" style={{ textTransform: 'capitalize' }}>
                    {order.status}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleViewDetails}>
            View Order Details
          </button>
          <button className="btn btn-secondary" onClick={handleViewAllOrders}>
            View All Orders
          </button>
          <button className="btn btn-ghost" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('order-confirmation-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<OrderConfirmation />);
}
```

## Test Scenarios

### Scenario 1: Order Created with Full Details
**Context**: Order created with customer, items, and total
**Result**: Widget displays success animation, order ID badge, complete summary with customer name, email, items list, total

### Scenario 2: Order Created with Minimal Data
**Context**: Order created with only order ID
**Result**: Widget displays success message and order ID, summary section hidden

### Scenario 3: View Order Details
**User**: Clicks "View Order Details"
**Result**: Message sent to Claude, order details widget loads with full order information

### Scenario 4: View All Orders
**User**: Clicks "View All Orders"
**Result**: Message sent to Claude, order list widget loads

### Scenario 5: Continue Shopping
**User**: Clicks "Continue Shopping"
**Result**: Message sent to Claude, product grid widget loads

## Integration Points

1. **Checkout → Order Confirmation**:
   - After successful `create_order`, Claude triggers confirmation widget
   - Order data passed via `toolInput`
   - Widget displays order ID and summary

2. **Order Confirmation → Order Details**:
   - `handleViewDetails()` sends message with order ID
   - Claude calls `view_order` tool
   - Order details widget loads

3. **Order Confirmation → Order List**:
   - `handleViewAllOrders()` sends message
   - Claude calls `list_orders` tool
   - Order list widget loads

4. **Order Confirmation → Product Grid**:
   - `handleContinueShopping()` sends message
   - Claude calls `get_product_list` tool
   - Product grid widget loads

## Data Flow

```typescript
// Tool input structure
{
  data: {
    order: {
      id: "12345",
      customer: {
        name: "John Doe",
        email: "john@example.com"
      },
      items: [
        { name: "Product A", quantity: 2 },
        { name: "Product B", quantity: 1 }
      ],
      total: 299.99,
      status: "pending"
    }
  }
}
```

## Widget State Schema

This widget does not use persistent widget state - it displays data passed via `toolInput`.

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/order-confirmation.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/order-confirmation.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Animation Details

The widget includes smooth animations for a delightful user experience:

1. **Success Icon**: Scale-in animation (0.5s)
2. **Title**: Fade-in with delay (0.6s, 0.2s delay)
3. **Subtitle**: Fade-in with delay (0.6s, 0.3s delay)
4. **Order Badge**: Fade-in with delay (0.6s, 0.4s delay)
5. **Summary**: Fade-in with delay (0.6s, 0.5s delay)
6. **Action Buttons**: Fade-in with delay (0.6s, 0.6s delay)

Total animation sequence: ~1.2 seconds for complete reveal.

## Status

✅ **Complete** - Ready for production implementation
