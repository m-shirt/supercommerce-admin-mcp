import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal } from '../hooks';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Customer {
  name: string;
  email: string;
  phone?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

interface Order {
  id: string | number;
  orderNumber?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  customer: Customer;
  deliveryAddress: Address;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
  trackingNumber?: string;
}

function OrderStatus() {
  // Track toolOutput changes
  const [toolOutput, setToolOutput] = useState<any>((window as any).openai?.toolOutput);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentOutput = (window as any).openai?.toolOutput;
      if (currentOutput !== toolOutput) {
        setToolOutput(currentOutput);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [toolOutput]);

  // Parse order data from toolOutput
  const orderData: Order = useMemo(() => {
    if (toolOutput?.result?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.result.content[0].text);
        return apiResponse?.order || apiResponse || getDefaultOrder();
      } catch (e) {
        console.error('Failed to parse order:', e);
      }
    }
    if (toolOutput?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.content[0].text);
        return apiResponse?.order || apiResponse || getDefaultOrder();
      } catch (e) {
        console.error('Failed to parse order:', e);
      }
    }
    return getDefaultOrder();
  }, [toolOutput]);

  function getDefaultOrder(): Order {
    return {
    id: '12345',
    orderNumber: 'ORD-12345',
    status: 'processing',
    items: [],
    customer: { name: 'Customer', email: 'customer@example.com' },
    deliveryAddress: { street: '', city: '', state: '', zip: '' },
    paymentMethod: 'Credit Card',
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
    };
  }

  // Display mode for responsive layout
  const displayMode = useOpenAiGlobal('displayMode');

  const [currentStatus, setCurrentStatus] = useState(orderData.status);

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(currentStatus);

  const handleUpdateStatus = () => {
    const nextIndex = Math.min(currentStepIndex + 1, statusOrder.length - 1);
    const nextStatus = statusOrder[nextIndex] as Order['status'];
    setCurrentStatus(nextStatus);
    (window as any).openai?.sendFollowUpMessage?.(`Updated order ${orderData.orderNumber || orderData.id} status to: ${nextStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`order-status-container ${displayMode}`}>
      <style>{`
        .order-status-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .status-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .status-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .order-number {
          color: white;
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .status-timeline {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .timeline-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 1rem;
        }

        .timeline-line {
          position: absolute;
          top: 30px;
          left: 0;
          right: 0;
          height: 4px;
          background: #e5e7eb;
          z-index: 0;
        }

        .timeline-progress {
          position: absolute;
          top: 30px;
          left: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.5s ease;
          z-index: 1;
        }

        .timeline-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #e5e7eb;
          border: 4px solid white;
          transition: all 0.3s;
          margin-bottom: 0.75rem;
        }

        .timeline-step.active .step-icon,
        .timeline-step.completed .step-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.1);
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-align: center;
        }

        .timeline-step.active .step-label,
        .timeline-step.completed .step-label {
          color: #667eea;
        }

        .order-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .order-status-container:not(.pip) .order-details {
          grid-template-columns: 2fr 1fr;
        }

        .details-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .order-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
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

        .item-quantity {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-price {
          font-weight: 600;
          color: #667eea;
          text-align: right;
        }

        .info-section {
          margin-bottom: 1.5rem;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .info-label {
          color: #6b7280;
        }

        .info-value {
          color: #1f2937;
          font-weight: 600;
        }

        .info-text {
          font-size: 0.875rem;
          color: #1f2937;
          line-height: 1.5;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .total-label {
          color: #667eea;
        }

        .total-value {
          color: #667eea;
        }

        .update-btn {
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

        .update-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .update-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .tracking-info {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .tracking-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .tracking-number {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .order-status-container:not(.pip) .order-details {
            grid-template-columns: 1fr;
          }

          .status-title {
            font-size: 1.5rem;
          }

          .timeline-steps {
            flex-wrap: wrap;
          }

          .step-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="status-header">
        <h1 className="status-title">Order Status</h1>
        <div className="order-number">Order #{orderData.orderNumber || orderData.id}</div>
      </div>

      <div className="status-timeline">
        <div className="timeline-steps">
          <div className="timeline-line"></div>
          <div
            className="timeline-progress"
            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>
          {statusSteps.map((step, index) => {
            const stepStatus = index < currentStepIndex ? 'completed' :
                             index === currentStepIndex ? 'active' : 'pending';
            return (
              <div key={step.key} className={`timeline-step ${stepStatus}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-label">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="order-details">
        <div className="details-card">
          <h2 className="card-title">Order Items</h2>
          <div className="order-items">
            {orderData.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23f3f4f6'/%3E%3C/svg%3E`}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                </div>
                <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="details-card">
            <h2 className="card-title">Customer Info</h2>
            <div className="info-section">
              <div className="info-text">
                <strong>{orderData.customer.name}</strong><br />
                {orderData.customer.email}<br />
                {orderData.customer.phone && <>{orderData.customer.phone}</>}
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">Delivery Address</div>
              <div className="info-text">
                {orderData.deliveryAddress.street}<br />
                {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.zip}
                {orderData.deliveryAddress.country && <><br />{orderData.deliveryAddress.country}</>}
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">Payment Method</div>
              <div className="info-text">{orderData.paymentMethod}</div>
            </div>

            <div className="info-section">
              <div className="section-title">Current Status</div>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(currentStatus) + '20', color: getStatusColor(currentStatus) }}
              >
                {currentStatus}
              </span>
            </div>

            {orderData.trackingNumber && (
              <div className="tracking-info">
                <div className="tracking-label">Tracking Number</div>
                <div className="tracking-number">{orderData.trackingNumber}</div>
              </div>
            )}
          </div>

          <div className="details-card" style={{ marginTop: '1.5rem' }}>
            <h2 className="card-title">Order Summary</h2>
            <div className="info-row">
              <span className="info-label">Subtotal</span>
              <span className="info-value">${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Tax</span>
              <span className="info-value">${orderData.tax.toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Shipping</span>
              <span className="info-value">${orderData.shipping.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-value">${orderData.total.toFixed(2)}</span>
            </div>
            <button
              className="update-btn"
              onClick={handleUpdateStatus}
              disabled={currentStatus === 'delivered'}
            >
              {currentStatus === 'delivered' ? 'Order Delivered' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mount widget
const root = document.getElementById('order-status-root');
if (root) {
  ReactDOM.createRoot(root).render(<OrderStatus />);
}
