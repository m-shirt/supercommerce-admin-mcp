const widgetResource = {
  uri: "ui://widget/shopping-cart.html",
  name: "shopping-cart",
  description: "Interactive shopping cart with quantity controls, item management, and order summary",
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
  <div id="shopping-cart-root"></div>
  <script type="module">
    // Dynamically detect origin (local dev or deployed)
    const origin = window.location.ancestorOrigins?.[0] || window.location.origin;

    // Load the compiled widget module
    import(origin + '/widgets/shopping-cart.js')
      .catch(err => {
        console.error('Failed to load shopping cart widget:', err);
        document.getElementById('shopping-cart-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/shopping-cart.html",
    "openai/widgetDescription": "Interactive shopping cart with quantity controls, item management, and order summary",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "🛒 Loading shopping cart...",
    "openai/toolInvocation/invoked": "✅ Shopping cart loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
