
function OrderListWidget() {
  const data = window.__WIDGET_DATA__ || {
    orders: [],
    total: 0,
  };

  const { orders = [], total = 0 } = data;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "✓";
      case "shipped":
        return "🚚";
      case "pending":
        return "⏱";
      case "cancelled":
        return "✕";
      default:
        return "📦";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { bg: "#d1fae5", text: "#065f46" };
      case "shipped":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "pending":
        return { bg: "#fef3c7", text: "#92400e" };
      case "cancelled":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .order-list-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .order-card {
          max-width: 800px;
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

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .order-item {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: background 0.2s;
          margin: 0 -1rem;
          padding: 1rem;
          border-radius: 8px;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item:hover {
          background: #f9fafb;
        }

        .order-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .order-details {
          flex: 1;
          min-width: 0;
        }

        .order-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .order-id {
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .meta-separator {
          color: #d1d5db;
        }

        .order-amount {
          text-align: right;
          flex-shrink: 0;
        }

        .amount-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.25rem;
        }

        .amount-items {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .empty-text {
          font-size: 1rem;
        }

        .view-all-btn {
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

        .view-all-btn:hover {
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .order-meta span:not(:first-child) {
            display: none;
          }

          .meta-separator {
            display: none;
          }
        }
      `}</style>

      <div className="order-list-container">
        <div className="order-card">
          {/* Header */}
          <div className="header">
            <div className="header-icon">🛒</div>
            <div className="header-text">
              <div className="header-title">Recent Orders</div>
              <div className="header-subtitle">
                {total} {total === 1 ? "order" : "orders"} found
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-text">No orders found</div>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => {
                const statusColor = getStatusColor(order.status);
                return (
                  <div key={order.id} className="order-item">
                    <div className="order-icon">📦</div>
                    <div className="order-details">
                      <div className="order-header">
                        <div className="order-id">{order.id}</div>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                          }}
                        >
                          <span>{getStatusIcon(order.status)}</span>
                          <span style={{ textTransform: 'capitalize' }}>
                            {order.status}
                          </span>
                        </span>
                      </div>
                      <div className="order-meta">
                        <span>{order.customer}</span>
                        <span className="meta-separator">•</span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                    <div className="order-amount">
                      <div className="amount-value">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="amount-items">
                        {order.items} {order.items === 1 ? "item" : "items"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Button */}
          {orders.length > 0 && (
            <button className="view-all-btn">
              View All Orders
            </button>
          )}
        </div>
      </div>
    </>
  );
}


// Mount the widget
const rootElement = document.getElementById('order-list-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<OrderListWidget />);
}
