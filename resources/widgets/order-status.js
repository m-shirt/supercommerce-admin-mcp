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
      "connect_domains": ["https://supercommerce-admin-mcp.vercel.app"],
      "resource_domains": ["https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating order status tracker...",
    "openai/toolInvocation/invoked": "order status tracker created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
