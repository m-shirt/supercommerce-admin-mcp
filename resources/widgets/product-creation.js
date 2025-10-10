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
  html: `<div id="product-creation-root"></div>
<link rel="stylesheet" href="https://supercommerce-admin-mcp.vercel.app/assets/product-creation-DdcgGox_.css">
<script type="module" src="https://supercommerce-admin-mcp.vercel.app/assets/product-creation-Cll7c-S-.js"></script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-creation.html",
    "openai/toolInvocation/invoking": "Creating product...",
    "openai/toolInvocation/invoked": "Product created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
