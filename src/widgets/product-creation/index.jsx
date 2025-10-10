import React from "react";

function ProductCreationWidget() {
  const data = window.__WIDGET_DATA__ || {
    status: "success",
    product: {
      id: null,
      name: "Sample Product",
      sku: "PROD-001",
      price: 99.99,
      inventory: 100,
      category: "Electronics",
      brand: ""
    },
  };

  const { status, product, error } = data;

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "pending":
        return "⚠";
      default:
        return "📦";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return { bg: "#f0fdf4", border: "#86efac", text: "#166534" };
      case "error":
        return { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" };
      case "pending":
        return { bg: "#fefce8", border: "#fde047", text: "#854d0e" };
      default:
        return { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" };
    }
  };

  const statusColor = getStatusColor();

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .product-creation-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .product-card {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f3f4f6;
          margin-bottom: 1.5rem;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        .header-text {
          flex: 1;
        }

        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .status-badge {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 2px solid;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          background: white;
          flex-shrink: 0;
        }

        .status-content {
          flex: 1;
        }

        .status-title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .status-error {
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .detail-item.full {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .detail-value.mono {
          font-family: 'Monaco', 'Courier New', monospace;
          color: #667eea;
        }

        .action-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .action-button:hover {
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full {
            grid-column: 1;
          }
        }
      `}</style>

      <div className="product-creation-container">
        <div className="product-card">
          {/* Header */}
          <div className="header">
            <div className="header-icon">📦</div>
            <div className="header-text">
              <div className="header-title">
                Product {status === "success" ? "Created" : "Creation"}
              </div>
              <div className="header-subtitle">
                Supercommerce E-Commerce Platform
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="status-badge"
            style={{
              backgroundColor: statusColor.bg,
              borderColor: statusColor.border,
              color: statusColor.text,
            }}
          >
            <div className="status-icon" style={{ color: statusColor.text }}>
              {getStatusIcon()}
            </div>
            <div className="status-content">
              <div className="status-title">
                {status === "success"
                  ? "Product successfully created"
                  : status === "error"
                  ? "Failed to create product"
                  : "Creating product..."}
              </div>
              {error && (
                <div className="status-error">{error}</div>
              )}
            </div>
          </div>

          {/* Product Details */}
          {product && status === "success" && (
            <>
              <div className="section-title">Product Details</div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">Product Name</div>
                  <div className="detail-value">{product.name}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">SKU</div>
                  <div className="detail-value mono">{product.sku}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Price</div>
                  <div className="detail-value">
                    ${product.price?.toFixed(2) || "0.00"}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Inventory</div>
                  <div className="detail-value">{product.inventory}</div>
                </div>

                {product.category && (
                  <div className="detail-item full">
                    <div className="detail-label">Category</div>
                    <div className="detail-value">{product.category}</div>
                  </div>
                )}

                {product.brand && (
                  <div className="detail-item full">
                    <div className="detail-label">Brand</div>
                    <div className="detail-value">{product.brand}</div>
                  </div>
                )}

                {product.id && (
                  <div className="detail-item full">
                    <div className="detail-label">Product ID</div>
                    <div className="detail-value mono">{product.id}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          {status === "success" && (
            <button className="action-button">
              View Product Details
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductCreationWidget;
