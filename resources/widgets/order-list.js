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
  html: `<div id="order-list-root"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/order-list-BGLz2zYA.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-list.html",
    "openai/toolInvocation/invoking": "Loading orders...",
    "openai/toolInvocation/invoked": "Orders loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
