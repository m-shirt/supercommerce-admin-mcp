const widgetResource = {
  uri: "ui://widget/shopping-cart.html",
  name: "shopping-cart",
  description: "Interactive shopping cart with quantity controls and real-time totals",
  mimeType: "text/html+skybridge",
  html: `<div id="shopping-cart-root"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/shopping-cart-iTNOTV85.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/shopping-cart.html",
    "openai/toolInvocation/invoking": "Creating shopping cart...",
    "openai/toolInvocation/invoked": "shopping cart created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
