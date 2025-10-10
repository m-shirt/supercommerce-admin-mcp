const widgetResource = {
  uri: "ui://widget/order-status.html",
  name: "order-status",
  description: "Order tracking with visual timeline showing delivery progress",
  mimeType: "text/html+skybridge",
  html: `<div id="order-status-root"></div>
<script type="module" src="https://supercommerce-admin-mcp.vercel.app/assets/order-status-z3d4f0Ic.js"></script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-status.html",
    "openai/toolInvocation/invoking": "Creating order status tracker...",
    "openai/toolInvocation/invoked": "order status tracker created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
