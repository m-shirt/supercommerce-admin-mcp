/**
 * Function to retrieve detailed information about a specific delivery manager.
 *
 * @param {Object} params - The parameters for retrieving delivery manager details.
 * @param {string} params.deliverer_id - The ID of the delivery manager to retrieve details for.
 * @returns {Promise<Object>} - The detailed delivery manager information.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { deliverer_id } = params;

    const url = `${baseURL}/api/admin/v2/deliverers/${deliverer_id}`;

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
    console.error('Error retrieving delivery manager details:', error);
    return { error: error.message || 'An error occurred while retrieving delivery manager details.' };
  }
};

/**
 * Tool configuration for retrieving delivery manager details.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_delivery_manager_details',
      description: 'Retrieve detailed information about a specific delivery manager including personal info, vehicle details, and delivery statistics.',
      parameters: {
        type: 'object',
        properties: {
          deliverer_id: {
            type: 'string',
            description: 'The ID of the delivery manager to retrieve details for.'
          }
        },
        required: ['deliverer_id']
      }
    }
  }
};

export { apiTool };