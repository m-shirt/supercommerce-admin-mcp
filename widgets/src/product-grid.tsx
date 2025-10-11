import { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { useWidgetState } from '../hooks';

interface Product {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  sku: string;
  price: number | null;
  stock: string | null;
  image: string | null;
  options: any[];
  cart_step: any | null;
  enable_step_package: number;
  step_package_label_ar: string | null;
  step_package_label_en: string | null;
  step_unit_label_ar: string | null;
  step_unit_label_en: string | null;
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
  // Widget state for cart
  const [widgetState, updateWidgetState] = useWidgetState<WidgetStateType>({
    cart: { items: [], total: 0 }
  });

  // Track toolOutput changes in React state to trigger re-renders
  const [toolOutput, setToolOutput] = useState<any>((window as any).openai?.toolOutput);

  // Poll for toolOutput changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentOutput = (window as any).openai?.toolOutput;
      if (currentOutput !== toolOutput) {
        setToolOutput(currentOutput);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [toolOutput]);

  // Display mode for responsive layout
  const displayMode = (window as any).openai?.displayMode || 'inline';

  // Parse products from toolOutput (memoized to prevent re-parsing)
  const products = useMemo(() => {

    // ChatGPT format: toolOutput.result.content[0].text contains JSON string
    if (toolOutput?.result?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.result.content[0].text);
        console.log('Parsed API response:', apiResponse);
        // Check if data is an array directly (dropdown endpoint)
        if (Array.isArray(apiResponse?.data)) {
          return apiResponse.data;
        }
        return apiResponse?.data?.data || apiResponse?.data?.products || apiResponse?.products || [];
      } catch (e) {
        console.error('Failed to parse toolOutput.result.content[0].text:', e);
      }
    }

    // Fallback: Direct content array (non-ChatGPT)
    if (toolOutput?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.content[0].text);
        console.log('Parsed API response (direct):', apiResponse);
        // Check if data is an array directly (dropdown endpoint)
        if (Array.isArray(apiResponse?.data)) {
          return apiResponse.data;
        }
        return apiResponse?.data?.data || apiResponse?.data?.products || apiResponse?.products || [];
      } catch (e) {
        console.error('Failed to parse toolOutput.content[0].text:', e);
      }
    }

    // Fallback: String
    if (typeof toolOutput === 'string') {
      try {
        const apiResponse = JSON.parse(toolOutput);
        // Check if data is an array directly (dropdown endpoint)
        if (Array.isArray(apiResponse?.data)) {
          return apiResponse.data;
        }
        return apiResponse?.data?.data || apiResponse?.data?.products || apiResponse?.products || [];
      } catch (e) {
        console.error('Failed to parse toolOutput string:', e);
      }
    }

    // Fallback: Already parsed
    if (Array.isArray(toolOutput?.data)) {
      return toolOutput.data;
    }
    if (toolOutput?.data?.data) {
      return toolOutput.data.data;
    }
    if (toolOutput?.data?.products) {
      return toolOutput.data.products;
    }

    console.log('No products found. toolOutput:', toolOutput);
    return [];
  }, [toolOutput]);

  // Local search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() === '') {
      return products;
    }
    return products.filter((p: Product) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

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
      // Add new item with data URI placeholder
      const cartImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E`;
      newCart = {
        items: [...widgetState.cart.items, {
          id: product.id,
          name: product.name,
          price: productPrice,
          quantity: 1,
          image: product.image || cartImage
        }],
        total: widgetState.cart.total + productPrice
      };
    }

    updateWidgetState({ cart: newCart });

    // Notify ChatGPT (only if function exists and is callable)
    const sendMessage = (window as any).openai?.sendFollowUpMessage;
    if (typeof sendMessage === 'function') {
      sendMessage({ prompt: `Added ${product.name} to cart` });
    }
  };

  const handleViewCart = () => {
    // Notify ChatGPT (only if function exists and is callable)
    const sendMessage = (window as any).openai?.sendFollowUpMessage;
    if (typeof sendMessage === 'function') {
      sendMessage({ prompt: 'Show my cart' });
    }
  };

  const getStockBadge = (stock: string | null) => {
    const stockNum = parseFloat(stock || '0');
    if (!stock || stockNum === 0) return { label: 'Out of Stock', className: 'stock-out' };
    if (stockNum <= 5) return { label: `Low (${stockNum})`, className: 'stock-low' };
    return { label: `In Stock (${stockNum})`, className: 'stock-in' };
  };

  const cartItemCount = widgetState.cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Debug: Log products count only (removed detailed logging to avoid DataCloneError)
  useEffect(() => {
    console.log('Products loaded:', products.length);
  }, [products.length]);

  // Show loading state only if we have no products parsed
  if (products.length === 0) {
    return (
      <div className="product-grid-container loading">
        <style>{`
          .product-grid-container.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-content {
            text-align: center;
            color: white;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Products...</h2>
          <p>Waiting for data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-grid-container ${displayMode}`}>
      <style>{`
        .product-grid-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
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
          width: 50%;
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
          height: 2.7rem;
          line-height: 1.35rem;
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
            const stockNum = parseFloat(product.stock || '0');
            // Use data URI for placeholder to avoid CSP issues
            const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%239ca3af'%3E${encodeURIComponent(product.name.substring(0, 30))}%3C/text%3E%3C/svg%3E`;

            // Use product image directly - ChatGPT allows external images
            const productImage = product.image || placeholderImage;

            // Debug: Log image URL for first few products
            if (filteredProducts.indexOf(product) < 3) {
              console.log(`Product: ${product.name}, Image URL:`, productImage);
            }

            return (
              <div key={product.id} className="product-card">
                <img
                  src={productImage}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    console.error(`Failed to load image for ${product.name}:`, productImage);
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = placeholderImage;
                  }}
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">SKU: {product.sku}</p>
                  <div className="product-price">
                    {product.price ? `${product.price.toFixed(2)} EGP` : 'Price TBD'}
                  </div>
                  <span className={`stock-badge ${stockBadge.className}`}>
                    {stockBadge.label}
                  </span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stock || stockNum === 0}
                  >
                    {product.stock && stockNum > 0 ? 'Add to Cart' : 'Out of Stock'}
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
