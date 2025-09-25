/**
 * Function to activate a delivery manager.
 *
 * @param {Object} params - The parameters for activating a delivery manager.
 * @param {string} params.deliverer_id - The ID of the delivery manager to activate.
 * @returns {Promise<Object>} - The result of the delivery manager activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { deliverer_id } = params;

    const url = `${baseURL}/api/admin/deliverers/${deliverer_id}/activate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating delivery manager:', error);
    return { error: error.message || 'An error occurred while activating the delivery manager.' };
  }
};

/**
 * Tool configuration for activating a delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_delivery_manager',
      description: 'Activate a delivery manager to allow them to receive delivery assignments.',
      parameters: {
        type: 'object',
        properties: {
          deliverer_id: {
            type: 'string',
            description: 'The ID of the delivery manager to activate.'
          }
        },
        required: ['deliverer_id']
      }
    }
  }
};

export { apiTool };