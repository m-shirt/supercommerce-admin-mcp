// TEMPORARY: Only widget-enabled tools for ChatGPT testing
// Full list backed up in paths.js.backup
export const toolPaths = [
  // Widget-enabled tools only
  'supercommerce-api/get-product-list.js',          // → product-grid widget
  'supercommerce-api/show-shopping-cart.js',        // → shopping-cart widget
  'supercommerce-api/show-checkout-form.js',        // → checkout-form widget
  'supercommerce-api/list-orders.js',               // → order-list widget
  'supercommerce-api/view-order.js',                // → order-status widget
  'supercommerce-api/create-main-product.js',       // → product-creation widget
  'supercommerce-api/get-details-product-by-id.js', // → product-card widget
];
