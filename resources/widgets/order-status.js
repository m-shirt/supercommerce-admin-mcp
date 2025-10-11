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
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="order-status-root"></div>
  <script>
    (function() {
      const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = origin + '/api/widgets/order-status.jsx';
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-status.html",
    "openai/widgetDescription": "Order tracking with visual timeline showing delivery progress",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["unpkg.com"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Creating order status tracker...",
    "openai/toolInvocation/invoked": "order status tracker created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
