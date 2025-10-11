# Phase 3.1: Order List Widget

## Overview

**Widget Purpose**: Browse orders with filters and search
**Display Mode**: `pip` (picture-in-picture) for persistent access
**Primary CTAs**: "View Order Details", "Refresh List" (max 2 actions per order card)
**Tool(s) Required**:
- `list_orders` - Get paginated order list

## MCP Tool Definition

```javascript
// tools/supercommerce-api/list-orders.js (update existing with _meta)

const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page = '1', limit = '20', status } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (status) queryParams.append('status', status);

    const url = `${baseURL}/api/admin/v2/orders?${queryParams.toString()}`;

    const response = await fetch(url, {
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
    console.error('Error in listOrders:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_orders',
      description: 'Browse orders with filtering and search',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'Page number (default: 1)'
          },
          limit: {
            type: 'string',
            description: 'Items per page (default: 20)'
          },
          status: {
            type: 'string',
            description: 'Filter by order status (pending, processing, delivered, cancelled)'
          }
        },
        required: []
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/order-list.html',
      'openai/toolInvocation/invoking': '📋 Loading orders...',
      'openai/toolInvocation/invoked': '✅ Orders loaded'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/order-list.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="order-list-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/order-list.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/order-list.tsx

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
  };
  status: string;
  total: number;
  items_count: number;
  created_at: string;
}

function OrderList() {
  // Get API response from tool
  const apiResponse = (window as any).openai?.toolInput;
  const orders: Order[] = apiResponse?.data?.orders || apiResponse?.orders || [];

  // Filter and search state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // Apply filters
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order =>
        order.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Search by order ID, customer name, or email
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, activeFilter, orders]);

  const handleViewOrder = (orderId: number) => {
    (window as any).openai?.sendMessage(`Show order details for #${orderId}`);
  };

  const handleRefresh = () => {
    (window as any).openai?.sendMessage('Refresh order list');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <>
      <style>{`
        .order-list-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-left {
          flex: 1;
        }

        .list-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .list-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .refresh-btn {
          padding: 10px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .refresh-btn:hover {
          transform: scale(1.05);
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .filter-tab {
          padding: 8px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .filter-tab:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        .search-box {
          margin-bottom: 20px;
        }

        .search-input {
          width: 50%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .orders-grid {
          display: grid;
          gap: 16px;
        }

        .order-card {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .order-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .order-id {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
        }

        .order-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-transform: capitalize;
        }

        .order-customer {
          margin-bottom: 8px;
        }

        .customer-name {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2px;
        }

        .customer-email {
          font-size: 12px;
          color: #6b7280;
        }

        .order-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-info {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #6b7280;
        }

        .order-total {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .empty-subtitle {
          font-size: 14px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .order-list-container {
            padding: 16px;
          }

          .list-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .refresh-btn {
            width: 100%;
          }

          .order-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .order-info {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>

      <div className="order-list-container">
        <div className="list-header">
          <div className="header-left">
            <h1 className="list-title">Orders</h1>
            <p className="list-subtitle">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            </p>
          </div>
          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>

        <div className="filter-tabs">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-tab ${activeFilter === option.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No orders found</div>
            <div className="empty-subtitle">
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Orders will appear here once created'}
            </div>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => handleViewOrder(order.id)}
              >
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-customer">
                  <div className="customer-name">{order.customer.name}</div>
                  <div className="customer-email">{order.customer.email}</div>
                </div>

                <div className="order-details">
                  <div className="order-info">
                    <span>📦 {order.items_count} items</span>
                    <span>🕒 {formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-total">{formatPrice(order.total)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('order-list-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<OrderList />);
}
```

## Test Scenarios

### Scenario 1: View All Orders
**User**: "Show all my orders"
**Action**: Claude calls `list_orders` with no filters
**Result**: Widget displays all orders in grid layout with status badges

### Scenario 2: Filter by Status
**User**: Clicks "Pending" filter tab
**Result**: Widget filters to show only pending orders

### Scenario 3: Search Orders
**User**: Types "John" in search box
**Result**: Widget filters to show orders from customers with "John" in name

### Scenario 4: View Order Details
**User**: Clicks on order card
**Result**: Message sent to Claude, order details widget loads

### Scenario 5: Refresh List
**User**: Clicks "Refresh" button
**Result**: Claude re-calls `list_orders` tool, widget updates with fresh data

### Scenario 6: Empty State
**Context**: No orders match current filters
**Result**: Widget displays empty state with helpful message

## Integration Points

1. **Order Confirmation → Order List**:
   - After placing order, user clicks "View All Orders"
   - Claude calls `list_orders` tool
   - New order appears at top of list

2. **Order List → Order Details**:
   - User clicks order card
   - `handleViewOrder()` sends message with order ID
   - Claude calls `view_order` tool
   - Order details widget loads

3. **Filtering**:
   - Client-side filtering for instant results
   - Can be enhanced with server-side filtering via `status` parameter

4. **Search**:
   - Client-side search across ID, customer name, and email
   - Real-time filtering as user types

## Data Flow

```typescript
// API Response Structure
{
  data: {
    orders: [
      {
        id: 12345,
        customer: {
          name: "John Doe",
          email: "john@example.com"
        },
        status: "pending",
        total: 299.99,
        items_count: 3,
        created_at: "2024-01-15T10:30:00Z"
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 150
    }
  }
}
```

## Widget State Schema

This widget does not use persistent widget state - it displays data from `toolInput`.

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/order-list.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/order-list.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Status Badge Colors

- **Pending**: Orange (#f59e0b)
- **Processing**: Blue (#3b82f6)
- **Delivered**: Green (#10b981)
- **Cancelled**: Red (#ef4444)
- **Completed**: Green (#10b981)

## Status

✅ **Complete** - Ready for production implementation
