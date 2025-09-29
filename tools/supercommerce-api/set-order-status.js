/**
 * Function to set order status.
 *
 * @param {Object} params - The parameters for set order status.


 * @param {string} [params.order] - The order.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      order,
    } = params;

    const url = `${baseURL}/api/admin/order_states/15/set-order`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'order': order,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in setOrderStatus:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for set order status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_order_status',
      description: 'Set Order Status',
      parameters: {
        type: 'object',
        properties: {
          order: {
            type: 'string',
            description: 'The order'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };