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
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/product-creation-aQD6Mqyv.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-creation.html",
    "openai/toolInvocation/invoking": "Creating product...",
    "openai/toolInvocation/invoked": "Product created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
