const widgetResource = {
  uri: "ui://widget/checkout-form.html",
  name: "checkout-form",
  description: "Multi-step checkout process with contact, shipping, and payment",
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
  <div id="checkout-form-root"></div>
  <script type="module">
    const origin = 'https://supercommerce-admin-mcp.vercel.app';
    import(origin + '/widgets/checkout-form.js')
      .catch(err => {
        console.error('Failed to load checkout-form widget:', err);
        document.getElementById('checkout-form-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/checkout-form.html",
    "openai/widgetDescription": "Multi-step checkout process with contact, shipping, and payment",
    "openai/widgetCSP": {
      "connect_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"],
      "resource_domains": ["https://esm.sh", "https://supercommerce-admin-mcp.vercel.app"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating checkout form...",
    "openai/toolInvocation/invoked": "checkout form created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
