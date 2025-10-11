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
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="checkout-form-root"></div>
  <script>
    (function() {
      const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = origin + '/api/widgets/checkout-form.jsx';
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/checkout-form.html",
    "openai/widgetDescription": "Multi-step checkout process with contact, shipping, and payment",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["unpkg.com"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating checkout form...",
    "openai/toolInvocation/invoked": "checkout form created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
