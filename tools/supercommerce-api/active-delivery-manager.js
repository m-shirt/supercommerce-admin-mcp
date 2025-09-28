/**
 * Function to active delivery manager.
 *
 * @param {Object} params - The parameters for active delivery manager.
 * @param {string} params.delivery_id - The delivery id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      delivery_id,
    } = params;

    let url = `${baseURL}/api/admin/deliverers/${delivery_id}/activate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in activeDeliveryManager:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for active delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'active_delivery_manager',
      description: 'active Delivery Manager',
      parameters: {
        type: 'object',
        properties: {
          delivery_id: {
            type: 'string',
            description: 'The delivery id'
          }
        },
        required: ['delivery_id']
      }
    }
  }
};

export { apiTool };