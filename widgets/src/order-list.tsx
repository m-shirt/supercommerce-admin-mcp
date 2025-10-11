import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal } from '../hooks';

interface Order {
  id: number;
  reference_order: string;
  created_at: string;
  grand_total: number;
  customer: {
    full_name: string;
    phone: string;
    email: string;
  };
  state: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  payment_method: {
    name: string;
    name_en: string;
    name_ar: string;
  };
  address: {
    formatted_address: string;
  };
}

function OrderList() {
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

  // Parse orders from toolOutput
  const orders: Order[] = useMemo(() => {
    if (toolOutput?.result?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.result.content[0].text);
        return apiResponse?.data?.items || apiResponse?.items || [];
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    }
    if (toolOutput?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.content[0].text);
        return apiResponse?.data?.items || apiResponse?.items || [];
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    }
    return [];
  }, [toolOutput]);

  const displayMode = useOpenAiGlobal('displayMode');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.reference_order.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.phone.includes(searchQuery);
    const statusName = order.state.name_en.toLowerCase();
    const matchesStatus = statusFilter === 'all' || statusName === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (orderId: number) => {
    const sendMessage = (window as any).openai?.sendFollowUpMessage;
    if (typeof sendMessage === 'function') {
      sendMessage({ prompt: `View order ${orderId}` });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      placed: { bg: '#dbeafe', text: '#1e40af' },
      confirmed: { bg: '#e0e7ff', text: '#4338ca' },
      processing: { bg: '#fef3c7', text: '#92400e' },
      shipped: { bg: '#e0e7ff', text: '#4338ca' },
      delivered: { bg: '#d1fae5', text: '#065f46' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#1f2937' };
  };

  const statusCounts = {
    all: orders.length,
    placed: orders.filter(o => o.state.name_en.toLowerCase() === 'placed').length,
    confirmed: orders.filter(o => o.state.name_en.toLowerCase() === 'confirmed').length,
    processing: orders.filter(o => o.state.name_en.toLowerCase() === 'processing').length,
    shipped: orders.filter(o => o.state.name_en.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.state.name_en.toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => o.state.name_en.toLowerCase() === 'cancelled').length
  };

  // Show loading state
  if (orders.length === 0 && !toolOutput) {
    return (
      <div className="order-list-container loading">
        <style>{`
          .order-list-container.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div className="loading-spinner"></div>
          <h2>Loading Orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`order-list-container ${displayMode}`}>
      <style>{`
        .order-list-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .order-header {
          margin-bottom: 1.5rem;
        }

        .order-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .order-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }

        .filters {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .search-bar {
          margin-bottom: 1rem;
        }

        .search-input {
          width: 50%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .status-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-btn:hover {
          border-color: #667eea;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .filter-count {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .filter-btn.active .filter-count {
          background: rgba(255, 255, 255, 0.2);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-id {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .order-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .info-label {
          color: #6b7280;
        }

        .info-value {
          font-weight: 600;
          color: #1f2937;
        }

        .order-total {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .view-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .view-btn:hover {
          opacity: 0.9;
        }

        .empty-state {
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .orders-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="order-header">
        <h1 className="order-title">Orders</h1>
        <p className="order-subtitle">{orders.length} total orders</p>
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="status-filters">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Orders
            <span className="filter-count">{statusCounts.all}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'placed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('placed')}
          >
            Placed
            <span className="filter-count">{statusCounts.placed}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed
            <span className="filter-count">{statusCounts.confirmed}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('processing')}
          >
            Processing
            <span className="filter-count">{statusCounts.processing}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'shipped' ? 'active' : ''}`}
            onClick={() => setStatusFilter('shipped')}
          >
            Shipped
            <span className="filter-count">{statusCounts.shipped}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('delivered')}
          >
            Delivered
            <span className="filter-count">{statusCounts.delivered}</span>
          </button>
          <button
            className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled
            <span className="filter-count">{statusCounts.cancelled}</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const statusName = order.state.name_en.toLowerCase();
            const statusColor = getStatusColor(statusName);
            const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            return (
              <div key={order.id} className="order-card" onClick={() => handleViewOrder(order.id)}>
                <div className="order-card-header">
                  <h3 className="order-id">#{order.reference_order}</h3>
                  <span
                    className="order-status"
                    style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                  >
                    {order.state.name_en}
                  </span>
                </div>
                <div className="order-info">
                  <div className="info-row">
                    <span className="info-label">Customer</span>
                    <span className="info-value">{order.customer.full_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{order.customer.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date</span>
                    <span className="info-value">{orderDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Payment</span>
                    <span className="info-value">{order.payment_method.name_en}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total</span>
                    <span className="order-total">{order.grand_total.toFixed(2)} SAR</span>
                  </div>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mount widget
const root = document.getElementById('order-list-root');
if (root) {
  ReactDOM.createRoot(root).render(<OrderList />);
}
