/**
 * Order List Widget Resource
 *
 * Provides interactive UI for displaying order lists
 */

const widgetResource = {
  uri: "ui://widget/order-list.html",
  name: "order-list",
  description: "Interactive order list widget with status badges",
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
  <div id="order-list-root"></div>
  <script>
    (function() {
      const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = origin + '/api/widgets/order-list.jsx';
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-list.html",
    "openai/widgetDescription": "Interactive order list widget with status badges",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["unpkg.com"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Loading orders...",
    "openai/toolInvocation/invoked": "Orders loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
