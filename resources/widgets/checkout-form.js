const widgetResource = {
  uri: "ui://widget/checkout-form.html",
  name: "checkout-form",
  description: "Multi-step checkout process with contact, shipping, and payment",
  mimeType: "text/html+skybridge",
  html: `<div id="checkout-form-root"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = window.location.origin + '/assets/checkout-form-BVmsQOnt.js';
    document.head.appendChild(script);
  })();
</script>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/checkout-form.html",
    "openai/toolInvocation/invoking": "Creating checkout form...",
    "openai/toolInvocation/invoked": "checkout form created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
