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
  <div id="order-list-root"></div>
  <script type="module">
    const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
    import(origin + '/widgets/order-list.js')
      .catch(err => {
        console.error('Failed to load order-list widget:', err);
        document.getElementById('order-list-root').innerHTML =
          '<div style="padding: 2rem; text-align: center; color: #ef4444;">Failed to load widget</div>';
      });
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-list.html",
    "openai/widgetDescription": "Interactive order list widget with status badges",
    "openai/widgetCSP": {
      "connect_domains": [],
      "resource_domains": ["esm.sh"]
    },
    "openai/widgetPrefersBorder": true,
    "openai/toolInvocation/invoking": "Loading orders...",
    "openai/toolInvocation/invoked": "Orders loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
