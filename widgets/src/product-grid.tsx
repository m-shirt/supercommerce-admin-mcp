import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal, useWidgetState } from '../hooks';

interface Product {
  id: number;
  product_name: string;
  slug?: string;
  sku: string;
  price: number | null;
  stock: number | null;
  category?: string;
  is_active: number;
  product_variants_count?: number;
  parent_id?: number | null;
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

function ProductGrid() {
  // Get data from tool invocation
  const toolInput = (window as any).openai?.toolInput;
  const apiResponse = toolInput || {};
  const products: Product[] = apiResponse?.data?.products || apiResponse?.products || [];

  // Widget state for cart
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: { items: [], total: 0 }
  });

  // Display mode for responsive layout
  const displayMode = useOpenAiGlobal('displayMode');

  // Local search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    const existingItem = widgetState.cart.items.find(item => item.id === product.id);
    const productPrice = product.price || 0;

    let newCart;
    if (existingItem) {
      // Increment quantity
      newCart = {
        items: widgetState.cart.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        total: widgetState.cart.total + productPrice
      };
    } else {
      // Add new item
      newCart = {
        items: [...widgetState.cart.items, {
          id: product.id,
          name: product.product_name,
          price: productPrice,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }],
        total: widgetState.cart.total + productPrice
      };
    }

    updateWidgetState({ cart: newCart });

    // Notify Claude
    (window as any).openai?.sendMessage(`Added ${product.product_name} to cart (Price TBD)`);
  };

  const handleViewCart = () => {
    (window as any).openai?.sendMessage('Show my cart');
  };

  const getStockBadge = (stock: number | null) => {
    if (!stock || stock === 0) return { label: 'Out of Stock', className: 'stock-out' };
    if (stock <= 5) return { label: `Low (${stock})`, className: 'stock-low' };
    return { label: `In Stock (${stock})`, className: 'stock-in' };
  };

  const cartItemCount = widgetState.cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`product-grid-container ${displayMode}`}>
      <style>{`
        .product-grid-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .product-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .product-grid-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .cart-badge {
          position: relative;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .cart-badge:hover {
          transform: scale(1.05);
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .search-bar {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .product-grid-container.pip .product-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f3f4f6;
        }

        .product-info {
          padding: 1rem;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .stock-in {
          background: #d1fae5;
          color: #065f46;
        }

        .stock-low {
          background: #fef3c7;
          color: #92400e;
        }

        .stock-out {
          background: #fee2e2;
          color: #991b1b;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem;
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

        .empty-state {
          text-align: center;
          color: white;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }

          .product-grid-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="product-grid-header">
        <h1 className="product-grid-title">Products</h1>
        {cartItemCount > 0 && (
          <div className="cart-badge" onClick={handleViewCart}>
            🛒 Cart
            <span className="cart-count">{cartItemCount}</span>
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search products by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No products found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const stockBadge = getStockBadge(product.stock);
            return (
              <div key={product.id} className="product-card">
                <img
                  src={'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.product_name)}
                  alt={product.product_name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.product_name}</h3>
                  {product.category && (
                    <p className="product-description">{product.category}</p>
                  )}
                  <div className="product-price">
                    {product.price ? `$${product.price.toFixed(2)}` : 'Price TBD'}
                  </div>
                  <span className={`stock-badge ${stockBadge.className}`}>
                    {stockBadge.label}
                  </span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stock || product.stock === 0}
                  >
                    {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mount widget
const root = document.getElementById('product-grid-root');
if (root) {
  ReactDOM.createRoot(root).render(<ProductGrid />);
}
