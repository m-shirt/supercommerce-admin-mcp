const widgetResource = {
  uri: "ui://widget/product-grid.html",
  name: "product-grid",
  description: "Interactive product grid with search and filtering",
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
  <div id="product-grid-root"></div>
  <script>
    (function() {
      const origin = window.location.ancestorOrigins?.[0] || window.location.origin;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = origin + '/api/widgets/product-grid.jsx';
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>`,
  _meta: {
    "openai/outputTemplate": "ui://widget/product-grid.html",
    "openai/toolInvocation/invoking": "Creating product grid...",
    "openai/toolInvocation/invoked": "product grid created successfully",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
};

export { widgetResource };
