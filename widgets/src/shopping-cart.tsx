import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal, useWidgetState } from '../hooks';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

interface WidgetStateType {
  cart: {
    items: CartItem[];
    total: number;
  };
}

function ShoppingCart() {
  // Get data from tool invocation
  const toolInput = (window as any).openai?.toolInput;
  const apiResponse = toolInput || {};
  const initialItems: CartItem[] = apiResponse?.items || apiResponse?.cart?.items || [];

  // Widget state for cart
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: {
      items: initialItems,
      total: initialItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  });

  // Display mode for responsive layout
  const displayMode = useOpenAiGlobal('displayMode');

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = widgetState.cart.items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    updateWidgetState({
      cart: {
        items: updatedItems,
        total: newTotal
      }
    });
  };

  const handleRemoveItem = (itemId: number) => {
    const itemToRemove = widgetState.cart.items.find(item => item.id === itemId);
    const updatedItems = widgetState.cart.items.filter(item => item.id !== itemId);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    updateWidgetState({
      cart: {
        items: updatedItems,
        total: newTotal
      }
    });

    if (itemToRemove) {
      (window as any).openai?.sendMessage(`Removed ${itemToRemove.name} from cart`);
    }
  };

  const handleCheckout = () => {
    (window as any).openai?.sendMessage('Proceed to checkout');
  };

  const handleContinueShopping = () => {
    (window as any).openai?.sendMessage('Show products');
  };

  const subtotal = widgetState.cart.total;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className={`shopping-cart-container ${displayMode}`}>
      <style>{`
        .shopping-cart-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .cart-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .item-count {
          color: white;
          font-size: 1rem;
          opacity: 0.9;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .shopping-cart-container:not(.pip) .cart-content {
          grid-template-columns: 2fr 1fr;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .item-sku {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.25rem;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: 6px;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .qty-btn:hover {
          background: #e5e7eb;
        }

        .qty-value {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: #1f2937;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        .item-subtotal {
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .subtotal-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .cart-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .summary-row:last-of-type {
          border-bottom: none;
          padding-top: 1rem;
          margin-top: 0.5rem;
          border-top: 2px solid #e5e7eb;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          font-weight: 600;
          color: #1f2937;
        }

        .summary-row:last-of-type .summary-label,
        .summary-row:last-of-type .summary-value {
          color: #667eea;
        }

        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }

        .checkout-btn:hover {
          opacity: 0.9;
        }

        .continue-shopping {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.2s;
        }

        .continue-shopping:hover {
          background: #f3f4f6;
        }

        .empty-cart {
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-cart h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-cart p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .shopping-cart-container:not(.pip) .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-item {
            flex-direction: column;
          }

          .item-image {
            width: 100%;
            height: 150px;
          }

          .item-subtotal {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>

      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <span className="item-count">
          {widgetState.cart.items.length} {widgetState.cart.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {widgetState.cart.items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <button className="checkout-btn" onClick={handleContinueShopping}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {widgetState.cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || 'https://via.placeholder.com/100?text=No+Image'}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  {item.sku && <div className="item-sku">SKU: {item.sku}</div>}
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="item-subtotal">
                  <div className="subtotal-amount">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tax (10%)</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="continue-shopping" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount widget
const root = document.getElementById('shopping-cart-root');
if (root) {
  ReactDOM.createRoot(root).render(<ShoppingCart />);
}
