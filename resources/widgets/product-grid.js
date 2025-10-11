const widgetResource = {
  uri: "ui://widget/product-grid.html",
  name: "product-grid",
  description: "Interactive product grid with search, cart management, and stock tracking",
  mimeType: "text/html+skybridge",
  text: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="product-grid-root"></div>
  <script type="module">
    // Use Vercel deployment URL for widget loading
    const origin = 'https://supercommerce-admin-mcp.vercel.app';

    // Load the compiled widget module
    import(origin + '/widgets/product-grid.js')
      .catch(err => {
        console.error('Failed to load product grid widget:', err);
        document.getElementById('product-grid-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-grid.html",
    "openai/widgetDescription": "Interactive product grid with search, cart management, and stock tracking",
    "openai/widgetCSP": {
      "connect_domains": ["https://supercommerce-admin-mcp.vercel.app"],
      "resource_domains": ["https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "🔍 Loading products...",
    "openai/toolInvocation/invoked": "✅ Products loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
