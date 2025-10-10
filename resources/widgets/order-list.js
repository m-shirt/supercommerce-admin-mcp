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
<link rel="stylesheet" href="https://supercommerce-admin-mcp.vercel.app/assets/order-list-DdcgGox_.css">
<script type="module" src="https://supercommerce-admin-mcp.vercel.app/assets/order-list-DwxYm-Sh.js"></script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/order-list.html",
    "openai/toolInvocation/invoking": "Loading orders...",
    "openai/toolInvocation/invoked": "Orders loaded successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
