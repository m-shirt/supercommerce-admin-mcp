import React, { useState } from 'react';

function ProductGrid() {
  const data = window.__WIDGET_DATA__ || {
    products: [],
    searchQuery: ''
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock <= 5) return { label: `Low Stock (${stock})`, color: '#f59e0b' };
    return { label: `In Stock (${stock})`, color: '#10b981' };
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .product-grid-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .header p {
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f3f4f6;
        }

        .product-info {
          padding: 1.25rem;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .stock-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .empty-state {
          text-align: center;
          color: white;
          padding: 4rem 2rem;
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .modal-close:hover {
          transform: scale(1.1);
        }

        .modal-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .modal-description {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .modal-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
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
          transition: transform 0.2s;
        }

        .add-to-cart-btn:hover {
          transform: scale(1.02);
        }

        .add-to-cart-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }

          .grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>

      <div className="product-grid-container">
        <div className="header">
          <h1>
            {data.searchQuery ? `Search Results for "${data.searchQuery}"` : 'Products'}
          </h1>
          <p>{data.products.length} {data.products.length === 1 ? 'product' : 'products'} found</p>
        </div>

        {data.products.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid">
            {data.products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <span
                        className="stock-badge"
                        style={{ backgroundColor: stockStatus.color }}
                      >
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>
                ×
              </button>
              <img
                src={selectedProduct.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                alt={selectedProduct.name}
                className="modal-image"
              />
              <div className="modal-body">
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-description">
                  {selectedProduct.description || 'No description available'}
                </p>
                <div className="modal-details">
                  <div className="detail-item">
                    <div className="detail-label">Price</div>
                    <div className="detail-value">${selectedProduct.price.toFixed(2)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Stock</div>
                    <div className="detail-value">{selectedProduct.stock} units</div>
                  </div>
                  {selectedProduct.category && (
                    <div className="detail-item">
                      <div className="detail-label">Category</div>
                      <div className="detail-value">{selectedProduct.category}</div>
                    </div>
                  )}
                  {selectedProduct.sku && (
                    <div className="detail-item">
                      <div className="detail-label">SKU</div>
                      <div className="detail-value">{selectedProduct.sku}</div>
                    </div>
                  )}
                </div>
                <button
                  className="add-to-cart-btn"
                  disabled={selectedProduct.stock === 0}
                >
                  {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductGrid;
