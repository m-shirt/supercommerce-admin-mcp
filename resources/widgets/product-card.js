const widgetResource = {
  uri: "ui://widget/product-card.html",
  name: "product-card",
  description: "Detailed product view with image gallery and add to cart",
  mimeType: "text/html+skybridge",
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="product-card-root"></div>
  <script>
    (function() {
      const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = origin + '/api/widgets/product-card.jsx';
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-card.html",
    "openai/toolInvocation/invoking": "Creating product card...",
    "openai/toolInvocation/invoked": "product card created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
