import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal, useWidgetState } from '../hooks';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  category?: string;
  brand?: string;
  active?: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface WidgetStateType {
  cart: {
    items: CartItem[];
    total: number;
  };
}

function ProductCard() {
  // Get data from tool invocation
  const toolInput = (window as any).openai?.toolInput;
  const apiResponse = toolInput || {};
  const product: Product = apiResponse?.product || apiResponse || {
    id: 0,
    name: 'Sample Product',
    description: 'Product description not available',
    price: 0,
    image: '',
    stock: 0,
    sku: 'N/A',
    category: 'Uncategorized',
    brand: 'Unknown'
  };

  // Widget state for cart
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: { items: [], total: 0 }
  });

  // Display mode for responsive layout
  const displayMode = useOpenAiGlobal('displayMode');

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const existingItem = widgetState.cart.items.find(item => item.id === product.id);

    let newCart;
    if (existingItem) {
      // Update quantity
      newCart = {
        items: widgetState.cart.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
        total: widgetState.cart.total + (product.price * quantity)
      };
    } else {
      // Add new item
      newCart = {
        items: [...widgetState.cart.items, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        }],
        total: widgetState.cart.total + (product.price * quantity)
      };
    }

    updateWidgetState({ cart: newCart });

    // Notify Claude
    (window as any).openai?.sendMessage(`Added ${quantity} x ${product.name} to cart ($${(product.price * quantity).toFixed(2)})`);

    // Reset quantity
    setQuantity(1);
  };

  const handleViewAllProducts = () => {
    (window as any).openai?.sendMessage('Show all products');
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', color: '#ef4444', bgColor: '#fee2e2' };
    } else if (product.stock <= 5) {
      return { label: `Only ${product.stock} left`, color: '#f59e0b', bgColor: '#fef3c7' };
    } else {
      return { label: `${product.stock} in stock`, color: '#10b981', bgColor: '#d1fae5' };
    }
  };

  const stockStatus = getStockStatus();
  const totalPrice = product.price * quantity;

  return (
    <div className={`product-card-container ${displayMode}`}>
      <style>{`
        .product-card-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .back-btn {
          padding: 0.5rem 1rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f3f4f6;
        }

        .product-detail {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .product-card-container:not(.pip) .product-layout {
          grid-template-columns: 1fr 1fr;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 12px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .placeholder-icon {
          font-size: 5rem;
          color: #9ca3af;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-header {
          margin-bottom: 1.5rem;
        }

        .product-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }

        .product-sku {
          font-family: monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .product-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .category-badge {
          background: #ede9fe;
          color: #6d28d9;
        }

        .brand-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 1rem;
        }

        .product-price {
          font-size: 3rem;
          font-weight: 700;
          color: #667eea;
          margin: 1.5rem 0;
        }

        .product-description {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .quantity-section {
          margin-bottom: 1.5rem;
        }

        .section-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.5rem;
          width: fit-content;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
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

        .qty-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-value {
          min-width: 60px;
          text-align: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .price-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-label {
          font-size: 1rem;
          color: #6b7280;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .add-to-cart-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .view-all-btn {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: #f3f4f6;
        }

        .cart-indicator {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
          border: 2px dashed #e5e7eb;
        }

        .cart-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .cart-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .product-card-container:not(.pip) .product-layout {
            grid-template-columns: 1fr;
          }

          .product-name {
            font-size: 1.5rem;
          }

          .product-price {
            font-size: 2rem;
          }

          .header-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="card-header">
        <h1 className="header-title">Product Details</h1>
        <button className="back-btn" onClick={handleViewAllProducts}>
          ← View All Products
        </button>
      </div>

      <div className="product-detail">
        <div className="product-layout">
          <div className="product-images">
            <div className="main-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="placeholder-icon">📦</div>
              )}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h2 className="product-name">{product.name}</h2>
              <div className="product-sku">SKU: {product.sku}</div>
              <div className="product-badges">
                {product.category && (
                  <span className="badge category-badge">{product.category}</span>
                )}
                {product.brand && (
                  <span className="badge brand-badge">{product.brand}</span>
                )}
              </div>
              <div
                className="stock-badge"
                style={{
                  backgroundColor: stockStatus.bgColor,
                  color: stockStatus.color
                }}
              >
                {stockStatus.label}
              </div>
            </div>

            <div className="product-price">
              ${product.price.toFixed(2)}
            </div>

            {product.description && (
              <div className="product-description">
                {product.description}
              </div>
            )}

            <div className="quantity-section">
              <div className="section-label">Quantity</div>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="price-summary">
              <span className="summary-label">Total Price</span>
              <span className="summary-value">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="view-all-btn" onClick={handleViewAllProducts}>
                Continue Shopping
              </button>
            </div>

            {widgetState.cart.items.length > 0 && (
              <div className="cart-indicator">
                <div className="cart-count">
                  {widgetState.cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                </div>
                <div className="cart-total">
                  ${widgetState.cart.total.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mount widget
const root = document.getElementById('product-card-root');
if (root) {
  ReactDOM.createRoot(root).render(<ProductCard />);
}
