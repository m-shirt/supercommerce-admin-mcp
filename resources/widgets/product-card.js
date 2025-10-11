const widgetResource = {
  uri: "ui://widget/product-card.html",
  name: "product-card",
  description: "Detailed product view with image gallery and add to cart",
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
  <div id="product-card-root"></div>
  <script type="module">
    const origin = 'https://supercommerce-admin-mcp.vercel.app';
    import(origin + '/widgets/product-card.js')
      .catch(err => {
        console.error('Failed to load product-card widget:', err);
        document.getElementById('product-card-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-card.html",
    "openai/widgetDescription": "Detailed product view with image gallery and add to cart",
    "openai/widgetCSP": {
      "connect_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"],
      "resource_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating product card...",
    "openai/toolInvocation/invoked": "product card created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
