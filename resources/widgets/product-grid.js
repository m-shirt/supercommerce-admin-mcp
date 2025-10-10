const widgetResource = {
  uri: "ui://widget/product-grid.html",
  name: "product-grid",
  description: "Interactive product grid with search and filtering",
  mimeType: "text/html+skybridge",
  html: `<div id="product-grid-root"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/product-grid-DIX64fB_.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-grid.html",
    "openai/toolInvocation/invoking": "Creating product grid...",
    "openai/toolInvocation/invoked": "product grid created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
