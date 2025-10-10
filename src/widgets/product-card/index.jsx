import React, { useState } from 'react';

function ProductCard() {
  const data = window.__WIDGET_DATA__ || {
    product: {
      id: '1',
      name: 'Product Name',
      description: 'Product description',
      price: 0,
      stock: 0,
      images: ['https://via.placeholder.com/500x400'],
      category: '',
      sku: '',
      brand: '',
      reviews: []
    }
  };

  const product = data.product;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/500x400?text=No+Image'];

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (product.stock <= 5) return { label: `Low Stock (${product.stock} left)`, color: '#f59e0b' };
    return { label: 'In Stock', color: '#10b981' };
  };

  const stockStatus = getStockStatus();

  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const decreaseQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity(Math.min(product.stock, quantity + 1));
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .product-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .product-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 3rem;
        }

        .image-gallery {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          background: #f3f4f6;
        }

        .thumbnails {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .thumbnails::-webkit-scrollbar {
          height: 6px;
        }

        .thumbnails::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .thumbnails::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 3px;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .thumbnail:hover {
          border-color: #667eea;
          opacity: 0.8;
        }

        .thumbnail.active {
          border-color: #667eea;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #667eea;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          color: #fbbf24;
          font-size: 1.25rem;
        }

        .rating-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .price-section {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 12px;
        }

        .price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .description-section {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 12px;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .description {
          color: #6b7280;
          line-height: 1.6;
        }

        .quantity-section {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 12px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .qty-btn {
          background: white;
          border: 2px solid #667eea;
          border-radius: 8px;
          width: 48px;
          height: 48px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #667eea;
          font-weight: 600;
        }

        .qty-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty-display {
          font-size: 1.5rem;
          font-weight: 600;
          min-width: 60px;
          text-align: center;
          color: #1f2937;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .add-to-cart-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.75rem;
        }

        .specs-table tr {
          border-bottom: 1px solid #e5e7eb;
        }

        .specs-table tr:last-child {
          border-bottom: none;
        }

        .specs-table td {
          padding: 0.75rem 0;
        }

        .specs-label {
          color: #6b7280;
          font-weight: 500;
        }

        .specs-value {
          color: #1f2937;
          font-weight: 600;
          text-align: right;
        }

        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
          }

          .product-title {
            font-size: 1.5rem;
          }

          .price {
            font-size: 2rem;
          }

          .main-image {
            height: 300px;
          }
        }
      `}</style>

      <div className="product-page">
        <div className="product-container">
          <div className="product-layout">
            {/* Left: Image Gallery */}
            <div className="image-gallery">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="main-image"
              />
              {images.length > 1 && (
                <div className="thumbnails">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="product-details">
              <h1 className="product-title">{product.name}</h1>

              {averageRating && (
                <div className="rating">
                  <div className="stars">
                    {'⭐'.repeat(Math.round(parseFloat(averageRating)))}
                  </div>
                  <span className="rating-text">
                    {averageRating} ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <div className="price-section">
                <div className="price">${product.price.toFixed(2)}</div>
                <span
                  className="stock-badge"
                  style={{ backgroundColor: stockStatus.color }}
                >
                  {stockStatus.label}
                </span>
              </div>

              <div className="description-section">
                <h3 className="section-title">Description</h3>
                <p className="description">{product.description}</p>
              </div>

              <div className="quantity-section">
                <h3 className="section-title">Quantity</h3>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={decreaseQuantity}
                    disabled={product.stock === 0 || quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={increaseQuantity}
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="add-to-cart-btn"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
              </button>

              {(product.category || product.sku || product.brand) && (
                <div className="description-section">
                  <h3 className="section-title">Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      {product.category && (
                        <tr>
                          <td className="specs-label">Category</td>
                          <td className="specs-value">{product.category}</td>
                        </tr>
                      )}
                      {product.sku && (
                        <tr>
                          <td className="specs-label">SKU</td>
                          <td className="specs-value">{product.sku}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr>
                          <td className="specs-label">Brand</td>
                          <td className="specs-value">{product.brand}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
