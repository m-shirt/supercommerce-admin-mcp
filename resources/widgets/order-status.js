const widgetResource = {
  uri: "ui://widget/order-status.html",
  name: "order-status",
  description: "Order tracking with visual timeline showing delivery progress",
  mimeType: "text/html+skybridge",
  text: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime"
      }
    }
  </script>
</head>
<body>
  <div id="order-status-root"></div>
  <script type="module">
    const origin = 'https://supercommerce-admin-mcp.vercel.app';
    import(origin + '/widgets/order-status.js')
      .catch(err => {
        console.error('Failed to load order-status widget:', err);
        document.getElementById('order-status-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-status.html",
    "openai/widgetDescription": "Order tracking with visual timeline showing delivery progress",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating order status tracker...",
    "openai/toolInvocation/invoked": "order status tracker created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
