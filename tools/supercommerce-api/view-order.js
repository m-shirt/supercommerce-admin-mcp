/**
 * Function to view order.
 *
 * @param {Object} params - The parameters for view order.
 * @param {string} params.order_id - The order id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      order_id,
    } = params;

    let url = `${baseURL}/api/admin/orders/${order_id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in viewOrder:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for view order.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_order',
      description: 'View Order',
      _meta: {
        'openai/outputTemplate': 'ui://widget/order-status.html',
        'openai/toolInvocation/invoking': '📦 Loading order details...',
        'openai/toolInvocation/invoked': '✅ Order details loaded'
      },
      parameters: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'The order id'
          }
        },
        required: ['order_id']
      }
    }
  }
};

export { apiTool };