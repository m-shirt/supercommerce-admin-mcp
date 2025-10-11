import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [widgetContent, setWidgetContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sampleData, setSampleData] = useState('{}');
  const [previewMode, setPreviewMode] = useState('preview');
  const [serverUrl, setServerUrl] = useState(
    typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : ''
  );
  const [serverInput, setServerInput] = useState(
    typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : ''
  );
  const [connected, setConnected] = useState(false);

  async function rpcRequest(method, params = {}) {
    const res = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method,
        params,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const match = text.match(/data:\s*(\{.*\})/);
    if (!match) throw new Error('No JSON payload in SSE response');
    const json = JSON.parse(match[1]);
    if (json.error) throw new Error(json.error.message || 'Unknown RPC error');
    return json.result;
  }

  async function loadWidgets() {
    try {
      setLoading(true);
      const result = await rpcRequest('resources/list');
      setWidgets(result.resources || []);
      setConnected(true);
      setError('');
    } catch (e) {
      setError(`Failed to load widgets: ${e.message}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function connect() {
    setError('');
    try {
      setLoading(true);
      setServerUrl(serverInput);

      const res = await fetch(serverInput, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/event-stream',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now().toString(),
          method: 'resources/list',
          params: {},
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const match = text.match(/data:\s*(\{.*\})/);
      if (!match) throw new Error('No JSON payload in SSE response');
      const json = JSON.parse(match[1]);
      if (json.error) throw new Error(json.error.message || 'Unknown RPC error');

      setWidgets(json.result.resources || []);
      setConnected(true);
    } catch (e) {
      setError(`Failed to connect: ${e.message}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    setConnected(false);
    setWidgets([]);
    setSelectedWidget(null);
  }

  function reconnect() {
    disconnect();
    setTimeout(() => connect(), 100);
  }

  async function loadWidgetContent(uri) {
    try {
      const result = await rpcRequest('resources/read', { uri });
      setWidgetContent(result.contents[0]);
      setError('');
    } catch (e) {
      setError(`Failed to load widget content: ${e.message}`);
    }
  }

  useEffect(() => {
    if (selectedWidget) {
      loadWidgetContent(selectedWidget.uri);

      // Set sample data based on widget type
      if (selectedWidget.uri.includes('product-grid')) {
        setSampleData(JSON.stringify({
          products: [
            { id: 1, name: 'Wireless Headphones', price: 199.99, stock: 50, image: 'https://placehold.co/200x200/667eea/white?text=Product+1' },
            { id: 2, name: 'Smart Watch', price: 299.99, stock: 30, image: 'https://placehold.co/200x200/764ba2/white?text=Product+2' },
            { id: 3, name: 'Laptop Stand', price: 49.99, stock: 100, image: 'https://placehold.co/200x200/10b981/white?text=Product+3' },
            { id: 4, name: 'USB-C Hub', price: 79.99, stock: 75, image: 'https://placehold.co/200x200/3b82f6/white?text=Product+4' }
          ]
        }, null, 2));
      } else if (selectedWidget.uri.includes('cart') || selectedWidget.uri.includes('shopping-cart')) {
        setSampleData(JSON.stringify({
          items: [
            { id: 1, name: 'Wireless Headphones', price: 199.99, quantity: 1, image: 'https://placehold.co/100x100/667eea/white?text=Item+1' },
            { id: 2, name: 'Smart Watch', price: 299.99, quantity: 2, image: 'https://placehold.co/100x100/764ba2/white?text=Item+2' }
          ],
          subtotal: 799.97,
          tax: 79.99,
          shipping: 15.00,
          total: 894.96
        }, null, 2));
      } else if (selectedWidget.uri.includes('checkout')) {
        setSampleData(JSON.stringify({
          cartItems: [
            { id: 1, name: 'Wireless Headphones', price: 199.99, quantity: 1 },
            { id: 2, name: 'Smart Watch', price: 299.99, quantity: 2 }
          ],
          subtotal: 799.97,
          customers: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ],
          paymentMethods: [
            { id: 1, name: 'Credit Card' },
            { id: 2, name: 'Cash on Delivery' }
          ],
          cities: [
            { id: 1, name: 'Cairo' },
            { id: 2, name: 'Alexandria' }
          ]
        }, null, 2));
      } else if (selectedWidget.uri.includes('order-list')) {
        setSampleData(JSON.stringify({
          orders: [
            { id: 'ORD-001', customer: 'John Doe', total: 299.99, items: 3, status: 'delivered', date: '2025-10-10' },
            { id: 'ORD-002', customer: 'Jane Smith', total: 149.50, items: 2, status: 'processing', date: '2025-10-11' },
            { id: 'ORD-003', customer: 'Bob Johnson', total: 89.99, items: 1, status: 'pending', date: '2025-10-11' }
          ]
        }, null, 2));
      } else if (selectedWidget.uri.includes('order-details')) {
        setSampleData(JSON.stringify({
          order: {
            id: 'ORD-12345',
            date: '2025-10-11',
            status: 'processing',
            customer: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
            delivery: { address: '123 Main St', city: 'Cairo', country: 'Egypt' },
            payment: { method: 'Credit Card', last4: '4242' },
            items: [
              { id: 1, name: 'Wireless Headphones', quantity: 1, price: 199.99, image: 'https://placehold.co/60x60/667eea/white?text=1' }
            ],
            subtotal: 199.99,
            tax: 19.99,
            shipping: 15.00,
            total: 234.98
          },
          availableStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        }, null, 2));
      } else if (selectedWidget.uri.includes('order-confirmation')) {
        setSampleData(JSON.stringify({
          orderId: 'ORD-12345',
          customer: 'John Doe',
          total: 234.98,
          items: 1
        }, null, 2));
      } else if (selectedWidget.uri.includes('product-edit')) {
        setSampleData(JSON.stringify({
          product: {
            id: 123,
            name: 'Wireless Headphones',
            price: 199.99,
            stock: 50,
            is_active: true,
            sku: 'WH-001',
            category: 'Electronics',
            brand: 'AudioTech',
            image: 'https://placehold.co/150x150/667eea/white?text=Product'
          }
        }, null, 2));
      }
    }
  }, [selectedWidget]);

  const renderWidgetPreview = () => {
    if (!widgetContent) return null;

    if (previewMode === 'html') {
      return (
        <div style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '600px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {widgetContent.text}
          </pre>
        </div>
      );
    } else {
      // Live preview mode - inject the widget HTML into an iframe with sample data
      const htmlWithData = widgetContent.text.replace(
        '</head>',
        `<script>
          // Mock OpenAI SDK for preview
          window.openai = {
            widgetState: {
              get: () => ({}),
              set: (state) => console.log('[Preview] State updated:', state)
            },
            callTool: async (name, params) => {
              console.log('[Preview] Tool call:', name, params);
              return { success: true, data: {} };
            },
            sendMessage: async (msg) => {
              console.log('[Preview] Message:', msg);
            }
          };
          window.__WIDGET_DATA__ = ${sampleData};
        </script></head>`
      );

      const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  ${htmlWithData}
  <script>
    console.log('[Widget Preview] Widget loaded');
    console.log('[Widget Preview] Sample data:', window.__WIDGET_DATA__);
  </script>
</body>
</html>
      `;

      return (
        <iframe
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white'
          }}
          srcDoc={fullHtml}
          title="Widget Preview"
        />
      );
    }
  };

  return (
    <>
      <Head>
        <title>Widget Inspector - Supercommerce MCP</title>
      </Head>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .header {
          max-width: 1400px;
          margin: 0 auto 2rem;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .header p {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        .connection-panel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .connection-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .url-input {
          flex: 1;
          min-width: 300px;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .url-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .connect-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .connect-btn:hover {
          transform: scale(1.02);
        }

        .reconnect-btn {
          background: #f59e0b;
          color: white;
        }

        .disconnect-btn {
          background: #ef4444;
          color: white;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-dot.green {
          background: #10b981;
        }

        .status-dot.red {
          background: #ef4444;
        }

        .error {
          max-width: 1400px;
          margin: 0 auto 1rem;
          padding: 1rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 8px;
        }

        .content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
        }

        .sidebar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .sidebar h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .widget-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .widget-item {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .widget-item:hover {
          border-color: #667eea;
          background: #f9fafb;
        }

        .widget-item.active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .widget-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .widget-desc {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .main {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .widget-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .view-modes {
          display: flex;
          gap: 0.5rem;
        }

        .mode-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover {
          border-color: #667eea;
        }

        .mode-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .sample-data-editor {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .sample-data-editor h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.75rem 0;
        }

        .data-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          resize: vertical;
        }

        .data-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .widget-details {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .detail-row {
          margin-bottom: 0.75rem;
        }

        .detail-row strong {
          color: #1f2937;
          margin-right: 0.5rem;
        }

        .detail-row code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .meta-json {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-top: 0.5rem;
        }

        .placeholder {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .placeholder h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .loading, .empty {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🔍 Widget Inspector</h1>
          <p>Preview and test OpenAI Apps SDK widgets for Supercommerce MCP</p>

          <div className="connection-panel">
            <div className="connection-row">
              <input
                type="text"
                value={serverInput}
                onChange={(e) => setServerInput(e.target.value)}
                className="url-input"
                placeholder="MCP Server URL (e.g., http://localhost:3000/api/mcp)"
              />
              {!connected ? (
                <button onClick={connect} className="btn connect-btn">
                  Connect
                </button>
              ) : (
                <>
                  <button onClick={reconnect} className="btn reconnect-btn">
                    Reconnect
                  </button>
                  <button onClick={disconnect} className="btn disconnect-btn">
                    Disconnect
                  </button>
                </>
              )}
              <div className="status">
                <span className={`status-dot ${connected ? 'green' : 'red'}`} />
                <span>{connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        <div className="content">
          <div className="sidebar">
            <h2>Available Widgets ({widgets.length})</h2>

            {loading ? (
              <div className="loading">Loading widgets...</div>
            ) : widgets.length === 0 ? (
              <div className="empty">No widgets found. Connect to MCP server first.</div>
            ) : (
              <div className="widget-list">
                {widgets.map((widget) => (
                  <div
                    key={widget.uri}
                    className={`widget-item ${selectedWidget?.uri === widget.uri ? 'active' : ''}`}
                    onClick={() => setSelectedWidget(widget)}
                  >
                    <div className="widget-name">{widget.name}</div>
                    <div className="widget-desc">{widget.description}</div>
                    <span className="badge">{widget.mimeType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="main">
            {selectedWidget ? (
              <>
                <div className="widget-header">
                  <h2>{selectedWidget.name}</h2>
                  <div className="view-modes">
                    <button
                      className={`mode-btn ${previewMode === 'preview' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('preview')}
                    >
                      Preview
                    </button>
                    <button
                      className={`mode-btn ${previewMode === 'html' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('html')}
                    >
                      HTML Source
                    </button>
                  </div>
                </div>

                <div className="preview-container">
                  {renderWidgetPreview()}
                </div>

                {previewMode === 'preview' && (
                  <div className="sample-data-editor">
                    <h3>📝 Sample Data (edit to test different scenarios)</h3>
                    <textarea
                      className="data-textarea"
                      value={sampleData}
                      onChange={(e) => setSampleData(e.target.value)}
                      rows={10}
                    />
                  </div>
                )}

                <div className="widget-details">
                  <div className="detail-row">
                    <strong>URI:</strong> <code>{selectedWidget.uri}</code>
                  </div>
                  <div className="detail-row">
                    <strong>MIME Type:</strong> <code>{selectedWidget.mimeType}</code>
                  </div>
                  {selectedWidget.description && (
                    <div className="detail-row">
                      <strong>Description:</strong> {selectedWidget.description}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="placeholder">
                <h3>Select a widget to preview</h3>
                <p>Connect to your MCP server and choose a widget from the sidebar to see its preview and HTML source</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
