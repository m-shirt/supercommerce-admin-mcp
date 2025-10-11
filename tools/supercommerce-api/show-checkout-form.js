/**
 * Function to show checkout form widget.
 *
 * @param {Object} params - The parameters for showing checkout.
 * @returns {Promise<Object>} - Checkout form structure.
 */
const executeFunction = async (params) => {
  // This is a widget-only tool - it returns empty checkout structure
  // The widget will manage its own state and form data
  return {
    customers: [],
    cities: [],
    paymentMethods: [],
    message: "Checkout form widget loaded. Fill in the details to place an order."
  };
};

/**
 * Tool configuration for show checkout form.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'show_checkout_form',
      description: 'Show Checkout Form Widget',
      _meta: {
        'openai/outputTemplate': 'ui://widget/checkout-form.html',
        'openai/toolInvocation/invoking': '💳 Loading checkout form...',
        'openai/toolInvocation/invoked': '✅ Checkout form loaded',
        'openai/widgetAccessible': true,
        'openai/resultCanProduceWidget': true
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
