import React from 'react';

function OrderStatus() {
  const data = window.__WIDGET_DATA__ || {
    orderId: 'ORD-000000',
    status: 'pending',
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trackingNumber: null,
    items: [],
    shippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    subtotal: 0,
    total: 0
  };

  const stages = [
    { id: 'pending', label: 'Order Placed', icon: '📝' },
    { id: 'processing', label: 'Processing', icon: '⚙️' },
    { id: 'shipped', label: 'Shipped', icon: '🚚' },
    { id: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === data.status);

  const getStageClass = (index) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .order-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .order-header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }

        .order-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .order-number {
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .order-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .timeline {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 3rem 2rem;
          margin-bottom: 2rem;
        }

        .timeline-track {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin-bottom: 1rem;
        }

        .timeline-line {
          position: absolute;
          top: 30px;
          left: 60px;
          right: 60px;
          height: 4px;
          background: #e5e7eb;
          z-index: 0;
        }

        .timeline-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #667eea 100%);
          transition: width 0.5s ease;
        }

        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
          flex: 1;
        }

        .stage-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #e5e7eb;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .stage.completed .stage-circle {
          background: #10b981;
          transform: scale(1);
        }

        .stage.current .stage-circle {
          background: #667eea;
          transform: scale(1.15);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
        }

        .stage-label {
          margin-top: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-align: center;
        }

        .stage.current .stage-label {
          color: #667eea;
          font-size: 1rem;
        }

        .stage.completed .stage-label {
          color: #10b981;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .info-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .info-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .items-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .items-header {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .item-qty {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-price {
          font-weight: 600;
          color: #667eea;
        }

        .address-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .address-text {
          line-height: 1.6;
          color: #6b7280;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #6b7280;
        }

        .summary-row.total {
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .track-btn {
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
          margin-top: 1rem;
        }

        .track-btn:hover {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .timeline-track {
            flex-direction: column;
            gap: 2rem;
          }

          .timeline-line {
            top: 30px;
            bottom: 30px;
            left: 30px;
            width: 4px;
            height: auto;
            right: auto;
          }

          .stage {
            flex-direction: row;
            width: 100%;
            justify-content: flex-start;
            gap: 1rem;
          }

          .stage-label {
            margin-top: 0;
            text-align: left;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="order-container">
        <div className="order-header">
          <h1>Order Status</h1>
          <p className="order-number">Order #{data.orderId}</p>
        </div>

        <div className="order-content">
          {/* Timeline */}
          <div className="timeline">
            <div className="timeline-track">
              <div className="timeline-line">
                <div
                  className="timeline-progress"
                  style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                />
              </div>
              {stages.map((stage, index) => (
                <div key={stage.id} className={`stage ${getStageClass(index)}`}>
                  <div className="stage-circle">
                    {getStageClass(index) === 'completed' ? '✓' : stage.icon}
                  </div>
                  <div className="stage-label">{stage.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Order Date</div>
              <div className="info-value">{data.orderDate}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Estimated Delivery</div>
              <div className="info-value">{data.estimatedDelivery}</div>
            </div>
            {data.trackingNumber && (
              <div className="info-card">
                <div className="info-label">Tracking Number</div>
                <div className="info-value">{data.trackingNumber}</div>
              </div>
            )}
            <div className="info-card">
              <div className="info-label">Status</div>
              <div className="info-value" style={{ color: '#667eea' }}>
                {stages[currentStageIndex]?.label || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          {data.items.length > 0 && (
            <div className="items-card">
              <h2 className="items-header">Order Items</h2>
              {data.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.image || 'https://via.placeholder.com/60?text=No+Image'}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">Quantity: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shipping Address */}
          {data.shippingAddress.name && (
            <div className="address-card">
              <h2 className="card-title">Shipping Address</h2>
              <div className="address-text">
                {data.shippingAddress.name}<br />
                {data.shippingAddress.street}<br />
                {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.zip}<br />
                {data.shippingAddress.country}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="summary-card">
            <h2 className="card-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
            {data.trackingNumber && (
              <button className="track-btn">
                Track Package
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderStatus;
