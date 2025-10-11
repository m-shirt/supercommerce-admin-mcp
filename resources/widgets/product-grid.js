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
  <div id="product-grid-root"></div>
  <script type="module">
    // Dynamically detect origin (local dev or deployed)
    const origin = window.location.ancestorOrigins?.[0] || window.location.origin;

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
      "connect_domains": [],
      "resource_domains": ["https://esm.sh"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "🔍 Loading products...",
    "openai/toolInvocation/invoked": "✅ Products loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
