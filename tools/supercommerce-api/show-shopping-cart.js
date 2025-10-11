/**
 * Function to show shopping cart widget.
 *
 * @param {Object} params - The parameters for showing cart.
 * @returns {Promise<Object>} - Cart data or empty cart.
 */
const executeFunction = async (params) => {
  // This is a widget-only tool - it returns empty cart structure
  // The widget will manage its own state via window.openai.widgetState
  return {
    cart: {
      items: [],
      total: 0
    },
    message: "Shopping cart widget loaded. Add items from the product grid."
  };
};

/**
 * Tool configuration for show shopping cart.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'show_shopping_cart',
      description: 'Show Shopping Cart Widget',
      _meta: {
        'openai/outputTemplate': 'ui://widget/shopping-cart.html',
        'openai/toolInvocation/invoking': '🛒 Loading shopping cart...',
        'openai/toolInvocation/invoked': '✅ Shopping cart loaded'
      },
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };
