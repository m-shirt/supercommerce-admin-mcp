import React, { useState, useEffect } from 'react';

function ShoppingCart() {
  const initialData = window.__WIDGET_DATA__ || {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  };

  const [cartItems, setCartItems] = useState(initialData.items);
  const [totals, setTotals] = useState({
    subtotal: initialData.subtotal,
    tax: initialData.tax,
    shipping: initialData.shipping,
    total: initialData.total
  });

  useEffect(() => {
    // Recalculate totals when cart items change
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTax = newSubtotal * 0.1; // 10% tax
    const newShipping = cartItems.length > 0 ? 15.00 : 0;
    const newTotal = newSubtotal + newTax + newShipping;

    setTotals({
      subtotal: newSubtotal,
      tax: newTax,
      shipping: newShipping,
      total: newTotal
    });
  }, [cartItems]);

  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const formatPrice = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .cart-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .cart-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .cart-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .cart-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .item-count {
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .cart-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .cart-items {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-cart h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .cart-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .cart-item:last-child {
          border-bottom: none;
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
        }

        .item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .item-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .item-price {
          font-size: 1rem;
          color: #667eea;
          font-weight: 600;
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.25rem;
        }

        .qty-btn {
          background: white;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #667eea;
          font-weight: 600;
        }

        .qty-btn:hover {
          background: #667eea;
          color: white;
        }

        .qty-display {
          font-weight: 600;
          min-width: 40px;
          text-align: center;
          color: #1f2937;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.875rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #fee2e2;
        }

        .item-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .cart-summary {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          font-size: 1rem;
          color: #6b7280;
        }

        .summary-row.total {
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          margin-top: 1.5rem;
        }

        .checkout-btn:hover {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
          }

          .item-actions {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .cart-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <div className="cart-icon">🛒</div>
          <h1>Shopping Cart</h1>
          <p className="item-count">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some items to get started!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image || 'https://via.placeholder.com/100?text=No+Image'}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                    <p className="item-price">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️ Remove
                    </button>
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{formatPrice(totals.shipping)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;
