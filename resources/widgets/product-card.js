const widgetResource = {
  uri: "ui://widget/product-card.html",
  name: "product-card",
  description: "Detailed product view with image gallery and add to cart",
  mimeType: "text/html+skybridge",
  html: `<div id="product-card-root"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/product-card-nwA2U50T.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-card.html",
    "openai/toolInvocation/invoking": "Creating product card...",
    "openai/toolInvocation/invoked": "product card created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
