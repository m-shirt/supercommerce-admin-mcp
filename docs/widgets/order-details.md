# Phase 3.2: Order Details Widget

## Overview

**Widget Purpose**: View complete order information with status management
**Display Mode**: `fullscreen` for comprehensive view
**Primary CTAs**: "Change Status", "Back to Orders" (max 2 actions)
**Tool(s) Required**:
- `view_order` - Get complete order details
- `list_order_status` - Get available status options
- `set_order_status` - Update order status

## MCP Tool Definition

```javascript
// tools/supercommerce-api/view-order.js (update existing with _meta)

const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { order_id } = params;

    const response = await fetch(`${baseURL}/api/admin/v2/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in viewOrder:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_order',
      description: 'View complete order details with status management',
      parameters: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'Order ID to view'
          }
        },
        required: ['order_id']
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/order-details.html',
      'openai/toolInvocation/invoking': '📋 Loading order details...',
      'openai/toolInvocation/invoked': '✅ Order details loaded'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/order-details.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="order-details-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/order-details.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/order-details.tsx

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  image?: string;
  sku?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  type?: string;
}

interface OrderStatus {
  id: number;
  name: string;
  color?: string;
}

interface Order {
  id: number;
  status: string;
  customer: Customer;
  items: OrderItem[];
  delivery_address?: Address;
  payment_method?: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  created_at: string;
  updated_at?: string;
  notes?: string;
}

function OrderDetails() {
  // Get order data from tool input
  const apiResponse = (window as any).openai?.toolInput;
  const initialOrder: Order = apiResponse?.data?.order || apiResponse?.order || {};

  const [order, setOrder] = useState<Order>(initialOrder);
  const [availableStatuses, setAvailableStatuses] = useState<OrderStatus[]>([]);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Load available order statuses on mount
  useEffect(() => {
    async function loadStatuses() {
      try {
        const result = await (window as any).openai?.callTool('list_order_status', {});
        if (result?.data?.statuses) {
          setAvailableStatuses(result.data.statuses);
        }
      } catch (error) {
        console.error('Failed to load order statuses:', error);
      }
    }
    loadStatuses();
  }, []);

  const handleChangeStatus = async (newStatus: string) => {
    if (newStatus === order.status) {
      setShowStatusDropdown(false);
      return;
    }

    try {
      setChangingStatus(true);

      const result = await (window as any).openai?.callTool('set_order_status', {
        order_id: order.id.toString(),
        status: newStatus
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Update local order state
      setOrder({ ...order, status: newStatus });
      setShowStatusDropdown(false);

      // Send confirmation message
      (window as any).openai?.sendMessage(
        `Order #${order.id} status updated to ${newStatus}`
      );

    } catch (error: any) {
      console.error('Failed to update status:', error);
      (window as any).openai?.sendMessage(
        `Failed to update status: ${error.message}`
      );
    } finally {
      setChangingStatus(false);
    }
  };

  const handleBackToOrders = () => {
    (window as any).openai?.sendMessage('Show all my orders');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      completed: '#10b981'
    };
    return colors[status.toLowerCase()] || '#6b7280';
  };

  if (!order || !order.id) {
    return (
      <>
        <style>{`
          .error-container {
            max-width: 600px;
            margin: 48px auto;
            padding: 32px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .error-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .error-message {
            font-size: 14px;
            color: #6b7280;
          }
        `}</style>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Order Not Found</div>
          <div className="error-message">Unable to load order details</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px;
        }

        .details-header {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .order-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .order-date {
          font-size: 14px;
          color: #6b7280;
        }

        .status-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          text-transform: capitalize;
        }

        .change-status-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
          cursor: pointer;
          transition: all 0.2s;
        }

        .change-status-btn:hover {
          background: #667eea;
          color: white;
        }

        .change-status-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          min-width: 200px;
          z-index: 10;
        }

        .status-option {
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          color: #374151;
          text-transform: capitalize;
        }

        .status-option:hover {
          background: #f3f4f6;
        }

        .status-option:first-child {
          border-radius: 6px 6px 0 0;
        }

        .status-option:last-child {
          border-radius: 0 0 6px 6px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-icon {
          font-size: 20px;
        }

        .info-row {
          margin-bottom: 12px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
        }

        .items-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .item-row {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          background: #e5e7eb;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .item-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .item-sku {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .item-quantity {
          font-size: 14px;
          color: #6b7280;
        }

        .item-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
        }

        .item-unit-price {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .item-total {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .summary-total {
          border-top: 2px solid #e5e7eb;
          padding-top: 16px;
          margin-top: 16px;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .actions-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .btn {
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back {
          background: white;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        .btn-back:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        @media (max-width: 768px) {
          .details-container {
            padding: 16px;
          }

          .header-top {
            flex-direction: column;
            gap: 16px;
          }

          .status-section {
            width: 100%;
            justify-content: space-between;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .item-row {
            flex-direction: column;
          }

          .item-price {
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="details-container">
        {/* Header */}
        <div className="details-header">
          <div className="header-top">
            <div>
              <h1 className="order-title">Order #{order.id}</h1>
              <p className="order-date">Placed {formatDate(order.created_at)}</p>
            </div>
            <div className="status-section" style={{ position: 'relative' }}>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
              <button
                className="change-status-btn"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={changingStatus}
              >
                {changingStatus ? 'Updating...' : 'Change Status'}
              </button>

              {showStatusDropdown && (
                <div className="status-dropdown">
                  {availableStatuses.map((status) => (
                    <div
                      key={status.id}
                      className="status-option"
                      onClick={() => handleChangeStatus(status.name)}
                    >
                      {status.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="details-grid">
          {/* Customer Info */}
          <div className="info-card">
            <h3 className="card-title">
              <span className="card-icon">👤</span>
              Customer
            </h3>
            <div className="info-row">
              <div className="info-label">Name</div>
              <div className="info-value">{order.customer.name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Email</div>
              <div className="info-value">{order.customer.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone</div>
              <div className="info-value">{order.customer.phone}</div>
            </div>
          </div>

          {/* Delivery Info */}
          {order.delivery_address && (
            <div className="info-card">
              <h3 className="card-title">
                <span className="card-icon">📍</span>
                Delivery Address
              </h3>
              {order.delivery_address.street && (
                <div className="info-row">
                  <div className="info-label">Street</div>
                  <div className="info-value">{order.delivery_address.street}</div>
                </div>
              )}
              {order.delivery_address.city && (
                <div className="info-row">
                  <div className="info-label">City</div>
                  <div className="info-value">{order.delivery_address.city}</div>
                </div>
              )}
              {order.delivery_address.state && (
                <div className="info-row">
                  <div className="info-label">State</div>
                  <div className="info-value">{order.delivery_address.state}</div>
                </div>
              )}
              {order.delivery_address.zip && (
                <div className="info-row">
                  <div className="info-label">ZIP Code</div>
                  <div className="info-value">{order.delivery_address.zip}</div>
                </div>
              )}
            </div>
          )}

          {/* Payment Info */}
          {order.payment_method && (
            <div className="info-card">
              <h3 className="card-title">
                <span className="card-icon">💳</span>
                Payment
              </h3>
              <div className="info-row">
                <div className="info-label">Method</div>
                <div className="info-value">{order.payment_method.name}</div>
              </div>
              {order.payment_method.type && (
                <div className="info-row">
                  <div className="info-label">Type</div>
                  <div className="info-value">{order.payment_method.type}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="items-card">
          <h3 className="card-title">
            <span className="card-icon">📦</span>
            Order Items ({order.items.length})
          </h3>
          <div className="items-list">
            {order.items.map((item) => (
              <div key={item.id} className="item-row">
                <img
                  src={item.image || `https://via.placeholder.com/80?text=${encodeURIComponent(item.product_name)}`}
                  alt={item.product_name}
                  className="item-image"
                />
                <div className="item-info">
                  <div className="item-name">{item.product_name}</div>
                  {item.sku && <div className="item-sku">SKU: {item.sku}</div>}
                  <div className="item-quantity">Quantity: {item.quantity}</div>
                </div>
                <div className="item-price">
                  <div className="item-unit-price">
                    {formatPrice(item.price)} each
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="summary-card">
          <h3 className="card-title">
            <span className="card-icon">💰</span>
            Order Summary
          </h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-bar">
          <button className="btn btn-back" onClick={handleBackToOrders}>
            ← Back to Orders
          </button>
        </div>
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('order-details-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<OrderDetails />);
}
```

## Test Scenarios

### Scenario 1: View Order Details
**User**: "Show order details for #12345"
**Action**: Claude calls `view_order` with order_id
**Result**: Widget displays complete order information with all sections

### Scenario 2: Change Order Status
**User**: Clicks "Change Status" button
**Result**: Dropdown displays with available statuses from `list_order_status`

### Scenario 3: Update Status Successfully
**User**: Selects "Processing" from dropdown
**Action**: Widget calls `set_order_status` tool
**Result**: Status badge updates, confirmation message sent

### Scenario 4: Status Update Fails
**Context**: API returns error during status update
**Result**: Error message sent to Claude, status remains unchanged

### Scenario 5: Back to Orders
**User**: Clicks "Back to Orders" button
**Result**: Message sent to Claude, order list widget loads

### Scenario 6: Order Not Found
**Context**: Invalid order_id or API error
**Result**: Error state displayed with helpful message

## Integration Points

1. **Order List → Order Details**:
   - User clicks order card in list
   - Claude calls `view_order` with order ID
   - Widget displays full order information

2. **Order Confirmation → Order Details**:
   - User clicks "View Order Details" after placing order
   - Claude calls `view_order` with new order ID
   - Widget displays order information

3. **Order Details → Order List**:
   - User clicks "Back to Orders"
   - Claude calls `list_orders` tool
   - Order list widget loads

4. **Status Management**:
   - Widget loads available statuses via `list_order_status` on mount
   - User changes status via dropdown
   - Widget calls `set_order_status` to update
   - Local state updates immediately for responsive UX

## Data Flow

```typescript
// API Response Structure
{
  data: {
    order: {
      id: 12345,
      status: "pending",
      customer: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      },
      items: [
        {
          id: 1,
          product_name: "Product A",
          quantity: 2,
          price: 99.99,
          image: "https://...",
          sku: "PROD-A-001"
        }
      ],
      delivery_address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      payment_method: {
        id: 1,
        name: "Credit Card",
        type: "Visa"
      },
      subtotal: 199.98,
      tax: 20.00,
      shipping: 15.00,
      total: 234.98,
      created_at: "2024-01-15T10:30:00Z",
      notes: "Leave at door"
    }
  }
}
```

## Widget State Schema

This widget does not use persistent widget state - it displays data from `toolInput` and manages local UI state for status changes.

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/order-details.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/order-details.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Status

✅ **Complete** - Ready for production implementation
