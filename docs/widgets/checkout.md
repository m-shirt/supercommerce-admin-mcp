# Phase 2.1: Checkout Widget

## Overview

**Widget Purpose**: Simple checkout form with customer/payment/delivery selection
**Display Mode**: `fullscreen` for form interaction
**Primary CTAs**: "Place Order", "Back to Cart" (max 2 actions)
**Tool(s) Required**:
- `list_customers` - Get customer list for selection
- `list_payment_methods` - Get payment methods
- `list_cities` - Get cities for delivery
- `create_order` - Submit order

## MCP Tool Definition

```javascript
// tools/supercommerce-api/create-order-checkout.js

const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { customer_id, payment_method_id, city_id, items } = params;

    const response = await fetch(`${baseURL}/api/admin/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        customer_id,
        payment_method_id,
        city_id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createOrderCheckout:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_order_checkout',
      description: 'Complete checkout and create order',
      parameters: {
        type: 'object',
        properties: {
          customer_id: {
            type: 'string',
            description: 'Customer ID'
          },
          payment_method_id: {
            type: 'string',
            description: 'Payment method ID'
          },
          city_id: {
            type: 'string',
            description: 'Delivery city ID'
          },
          items: {
            type: 'array',
            description: 'Cart items to order',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                quantity: { type: 'number' }
              }
            }
          }
        },
        required: ['customer_id', 'payment_method_id', 'city_id', 'items']
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/checkout-simple.html',
      'openai/toolInvocation/invoking': '📝 Preparing checkout...',
      'openai/toolInvocation/invoked': '✅ Ready to place order'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/checkout-simple.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="checkout-simple-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/checkout-simple.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/checkout-simple.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface WidgetStateType {
  cart: {
    items: CartItem[];
    total: number;
  };
}

// Custom hook for widget state
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

function CheckoutSimple() {
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: { items: [], total: 0 }
  });

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load dropdown data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Call MCP tools to get dropdown data
        const [customersRes, paymentsRes, citiesRes] = await Promise.all([
          (window as any).openai?.callTool('list_customers', {
            page: '1',
            limit: '100'
          }),
          (window as any).openai?.callTool('list_payment_methods', {}),
          (window as any).openai?.callTool('list_cities', {})
        ]);

        if (customersRes?.data?.customers) {
          setCustomers(customersRes.data.customers);
        }
        if (paymentsRes?.data?.payment_methods) {
          setPaymentMethods(paymentsRes.data.payment_methods);
        }
        if (citiesRes?.data?.cities) {
          setCities(citiesRes.data.cities);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load checkout data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handlePlaceOrder = async () => {
    // Validation
    if (!selectedCustomer || !selectedPayment || !selectedCity) {
      setError('Please fill all required fields');
      return;
    }

    if (!widgetState.cart.items || widgetState.cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Call create_order tool
      const result = await (window as any).openai?.callTool('create_order', {
        customer_id: selectedCustomer,
        payment_method_id: selectedPayment,
        city_id: selectedCity,
        items: widgetState.cart.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success - clear cart and notify
      updateWidgetState({
        cart: { items: [], total: 0 }
      });

      // Send confirmation message with order data
      (window as any).openai?.sendMessage(
        `Order #${result.data?.order?.id || 'NEW'} placed successfully!`
      );

    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    (window as any).openai?.sendMessage('Show my cart');
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (loading) {
    return (
      <>
        <style>{`
          .checkout-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            font-size: 16px;
            color: #6b7280;
          }
        `}</style>
        <div className="checkout-loading">Loading checkout...</div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .checkout-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .checkout-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }
        .checkout-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        .checkout-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .form-section {
          margin-bottom: 24px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .form-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .order-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .summary-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #6b7280;
        }
        .summary-item:last-child {
          margin-bottom: 0;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }
        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .form-actions {
          display: flex;
          gap: 12px;
        }
        .btn {
          flex: 1;
          padding: 14px;
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
        .btn-primary:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }
        .btn-secondary:hover {
          background: #f9fafb;
        }
      `}</style>

      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">
            Complete your order in just a few clicks
          </p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="form-section">
          <label className="form-label">Customer *</label>
          <select
            className="form-select"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">Payment Method *</label>
          <select
            className="form-select"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="">Select payment method...</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">Delivery City *</label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select city...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="order-summary">
          <h3 className="summary-title">Order Summary</h3>
          {widgetState.cart.items.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(widgetState.cart.total)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-secondary"
            onClick={handleBackToCart}
            disabled={submitting}
          >
            Back to Cart
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={submitting}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('checkout-simple-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<CheckoutSimple />);
}
```

## Test Scenarios

### Scenario 1: Load Checkout
**User**: "Proceed to checkout" (from cart)
**Action**: Claude calls `create_order_checkout` tool
**Result**: Widget loads with dropdowns populated from API calls

### Scenario 2: Place Order Successfully
**User**: Selects customer, payment, city, clicks "Place Order"
**Result**: Order created, cart cleared, confirmation message sent

### Scenario 3: Validation Error
**User**: Clicks "Place Order" without selecting customer
**Result**: Error message displayed "Please fill all required fields"

### Scenario 4: API Error
**Context**: API returns error during order creation
**Result**: Error message displayed with details

### Scenario 5: Back to Cart
**User**: Clicks "Back to Cart"
**Result**: Message sent to show cart widget

## Integration Points

1. **Shopping Cart → Checkout**:
   - Cart widget calls `handleCheckout()` which sends message
   - Claude triggers `create_order_checkout` tool
   - Checkout loads with cart data from `widgetState`

2. **Checkout → Order Confirmation**:
   - On successful order, cart is cleared
   - `sendMessage()` triggers confirmation with order ID
   - Claude can call order confirmation widget

3. **Data Loading**:
   - Widget calls `list_customers`, `list_payment_methods`, `list_cities` on mount
   - Parallel API calls for performance
   - Handles loading and error states

## Widget State Schema

```typescript
{
  cart: {
    items: [
      {
        id: number,           // Product variant ID
        name: string,         // Product name
        price: number,        // Unit price
        quantity: number      // Quantity
      }
    ],
    total: number            // Total amount
  }
}
```

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/checkout-simple.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/checkout-simple.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Status

✅ **Complete** - Ready for production implementation
