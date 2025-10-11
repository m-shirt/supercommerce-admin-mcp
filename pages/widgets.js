import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './widgets.module.css';

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
      // Update the URL first
      setServerUrl(serverInput);

      // Make the request with the new URL directly
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

  // Removed auto-connect on mount - users must manually click Connect button
  // useEffect(() => {
  //   loadWidgets();
  // }, []);

  useEffect(() => {
    if (selectedWidget) {
      loadWidgetContent(selectedWidget.uri);

      // Set sample data based on widget name
      if (selectedWidget.name === 'product-creation') {
        setSampleData(JSON.stringify({
          status: 'success',
          product: {
            id: 12345,
            name: 'Premium Wireless Headphones',
            sku: 'PROD-WH-001',
            price: 199.99,
            inventory: 50,
            category: 'Electronics',
            brand: 'AudioTech'
          }
        }, null, 2));
      } else if (selectedWidget.name === 'order-list') {
        setSampleData(JSON.stringify({
          orders: [
            {
              id: 'ORD-001',
              customer: 'John Doe',
              total: 299.99,
              items: 3,
              status: 'delivered',
              date: '2025-10-10'
            },
            {
              id: 'ORD-002',
              customer: 'Jane Smith',
              total: 149.50,
              items: 2,
              status: 'shipped',
              date: '2025-10-11'
            },
            {
              id: 'ORD-003',
              customer: 'Bob Johnson',
              total: 89.99,
              items: 1,
              status: 'pending',
              date: '2025-10-11'
            }
          ],
          total: 3
        }, null, 2));
      } else if (selectedWidget.name === 'product-grid') {
        setSampleData(JSON.stringify({
          products: [
            { id: 1, name: 'Wireless Headphones', price: 199.99, stock: 50, image: 'https://placehold.co/200' },
            { id: 2, name: 'Smart Watch', price: 299.99, stock: 30, image: 'https://placehold.co/200' },
            { id: 3, name: 'Laptop', price: 999.99, stock: 15, image: 'https://placehold.co/200' },
            { id: 4, name: 'Phone Case', price: 29.99, stock: 100, image: 'https://placehold.co/200' }
          ],
          searchQuery: ''
        }, null, 2));
      } else if (selectedWidget.name === 'product-card') {
        setSampleData(JSON.stringify({
          product: {
            id: 1,
            name: 'Premium Wireless Headphones',
            description: 'High-quality wireless headphones with active noise cancellation',
            price: 199.99,
            stock: 50,
            images: ['https://placehold.co/500x400'],
            category: 'Electronics',
            sku: 'PROD-WH-001',
            brand: 'AudioTech',
            reviews: []
          }
        }, null, 2));
      } else if (selectedWidget.name === 'shopping-cart') {
        setSampleData(JSON.stringify({
          items: [
            { id: 1, name: 'Wireless Headphones', price: 199.99, quantity: 1, image: 'https://placehold.co/100' },
            { id: 2, name: 'Smart Watch', price: 299.99, quantity: 2, image: 'https://placehold.co/100' }
          ],
          subtotal: 799.97,
          tax: 79.99,
          shipping: 15.00,
          total: 894.96,
          currency: 'USD'
        }, null, 2));
      } else if (selectedWidget.name === 'checkout-form') {
        setSampleData(JSON.stringify({
          cartItems: [
            { name: 'Wireless Headphones', price: 199.99, quantity: 1 },
            { name: 'Smart Watch', price: 299.99, quantity: 2 }
          ],
          subtotal: 799.97
        }, null, 2));
      } else if (selectedWidget.name === 'order-status') {
        setSampleData(JSON.stringify({
          orderId: 'ORD-123456',
          status: 'shipped',
          orderDate: '2025-10-10',
          estimatedDelivery: '2025-10-15',
          trackingNumber: 'TRK-789012',
          items: [
            { id: 1, name: 'Wireless Headphones', quantity: 1, price: 199.99, image: 'https://placehold.co/60' }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102',
            country: 'USA'
          },
          subtotal: 199.99,
          total: 214.99
        }, null, 2));
      }
    }
  }, [selectedWidget]);

  const renderWidgetPreview = () => {
    if (!widgetContent) return null;

    if (previewMode === 'html') {
      return (
        <div className={styles.codeBlock}>
          <pre>{widgetContent.text}</pre>
        </div>
      );
    } else {
      // Live preview mode - inject the widget HTML into an iframe with sample data
      const htmlWithData = widgetContent.text.replace(
        '</head>',
        `<script>window.__WIDGET_DATA__ = ${sampleData};</script></head>`
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
  <script>
    console.log('[Widget Debug] Starting widget load...');
    window.addEventListener('error', (e) => {
      console.error('[Widget Error]', e.message, e.filename, e.lineno);
    });
  </script>
</head>
<body>
  ${htmlWithData}
  <script>
    console.log('[Widget Debug] Body loaded, checking root element...');
    console.log('[Widget Debug] Root elements:', document.querySelectorAll('[id$="-root"]'));
    console.log('[Widget Debug] All script tags:', document.querySelectorAll('script'));
    console.log('[Widget Debug] Body HTML:', document.body.innerHTML.substring(0, 500));
  </script>
</body>
</html>
      `;

      return (
        <iframe
          className={styles.widgetIframe}
          srcDoc={fullHtml}
          title="Widget Preview"
        />
      );
    }
  };

  return (
    <>
      <Head>
        <title>Widgets - Supercommerce MCP</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Widget Viewer</h1>
          <div className={styles.headerActions}>
            <div className={styles.connectionPanel}>
              <label className={styles.urlLabel}>MCP Connection URL</label>
              <div className={styles.connectionRow}>
                <input
                  type="text"
                  value={serverInput}
                  onChange={(e) => setServerInput(e.target.value)}
                  className={styles.urlInput}
                  placeholder="http://localhost:3001/api/mcp"
                />
                {!connected ? (
                  <button onClick={connect} className={styles.connectBtn}>
                    Connect
                  </button>
                ) : (
                  <>
                    <button onClick={reconnect} className={styles.reconnectBtn}>
                      Reconnect
                    </button>
                    <button onClick={disconnect} className={styles.disconnectBtn}>
                      Disconnect
                    </button>
                  </>
                )}
                <div className={styles.status}>
                  <span
                    className={`${styles.statusDot} ${
                      connected ? styles.green : styles.red
                    }`}
                  />
                  <span>{connected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
            <a href="/" className={styles.backBtn}>← Back to Chat</a>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            ❌ {error}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.sidebar}>
            <h2>Available Widgets ({widgets.length})</h2>

            {loading ? (
              <div className={styles.loading}>Loading widgets...</div>
            ) : widgets.length === 0 ? (
              <div className={styles.empty}>No widgets found</div>
            ) : (
              <div className={styles.widgetList}>
                {widgets.map((widget) => (
                  <div
                    key={widget.uri}
                    className={`${styles.widgetItem} ${selectedWidget?.uri === widget.uri ? styles.active : ''}`}
                    onClick={() => setSelectedWidget(widget)}
                  >
                    <div className={styles.widgetName}>{widget.name}</div>
                    <div className={styles.widgetDesc}>{widget.description}</div>
                    <div className={styles.widgetMeta}>
                      <span className={styles.badge}>{widget.mimeType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.main}>
            {selectedWidget ? (
              <>
                <div className={styles.widgetHeader}>
                  <h2>{selectedWidget.name}</h2>
                  <div className={styles.viewModes}>
                    <button
                      className={`${styles.modeBtn} ${previewMode === 'html' ? styles.active : ''}`}
                      onClick={() => setPreviewMode('html')}
                    >
                      HTML
                    </button>
                    <button
                      className={`${styles.modeBtn} ${previewMode === 'preview' ? styles.active : ''}`}
                      onClick={() => setPreviewMode('preview')}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <div className={styles.previewContainer}>
                  {renderWidgetPreview()}
                </div>

                {previewMode === 'preview' && (
                  <div className={styles.sampleDataEditor}>
                    <h3>Sample Data</h3>
                    <textarea
                      className={styles.dataTextarea}
                      value={sampleData}
                      onChange={(e) => setSampleData(e.target.value)}
                      rows={8}
                    />
                  </div>
                )}

                <div className={styles.widgetDetails}>
                  <div className={styles.detailRow}>
                    <strong>URI:</strong> <code>{selectedWidget.uri}</code>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>MIME Type:</strong> <code>{selectedWidget.mimeType}</code>
                  </div>
                  {selectedWidget._meta && (
                    <div className={styles.detailRow}>
                      <strong>Metadata:</strong>
                      <pre className={styles.metaJson}>
                        {JSON.stringify(selectedWidget._meta, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.placeholder}>
                <h3>Select a widget to view</h3>
                <p>Choose a widget from the sidebar to see its HTML code and preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
