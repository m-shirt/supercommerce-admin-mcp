/**
 * Product Creation Widget Resource
 *
 * Provides interactive UI for product creation results
 */

const widgetResource = {
  uri: "ui://widget/product-creation.html",
  name: "product-creation",
  description: "Interactive product creation widget with status indicators",
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
  <div id="product-creation-root"></div>
  <script type="module">
    const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
    import(origin + '/widgets/product-creation.js')
      .catch(err => {
        console.error('Failed to load product-creation widget:', err);
        document.getElementById('product-creation-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-creation.html",
    "openai/widgetDescription": "Interactive product creation widget with status indicators",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating product...",
    "openai/toolInvocation/invoked": "Product created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
