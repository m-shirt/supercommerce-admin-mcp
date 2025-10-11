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
</head>
<body>
  <div id="product-creation-root"></div>
  <script type="module">
    const origin = 'https://supercommerce-admin-mcp.vercel.app';
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
      "connect_domains": ["https://supercommerce-admin-mcp.vercel.app"],
      "resource_domains": ["https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating product...",
    "openai/toolInvocation/invoked": "Product created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
