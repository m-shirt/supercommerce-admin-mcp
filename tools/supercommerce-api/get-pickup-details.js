/**
 * Function to retrieve detailed information about a specific pickup/delivery.
 *
 * @param {Object} params - The parameters for retrieving pickup details.
 * @param {string} params.pickup_id - The ID of the pickup to retrieve details for.
 * @returns {Promise<Object>} - The detailed pickup information.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { pickup_id } = params;

    const url = `${baseURL}/api/admin/pickups/${pickup_id}`;

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
    console.error('Error retrieving pickup details:', error);
    return { error: error.message || 'An error occurred while retrieving pickup details.' };
  }
};

/**
 * Tool configuration for retrieving pickup details.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_pickup_details',
      description: 'Retrieve detailed information about a specific pickup/delivery including order items, delivery status, and deliverer information.',
      parameters: {
        type: 'object',
        properties: {
          pickup_id: {
            type: 'string',
            description: 'The ID of the pickup to retrieve details for.'
          }
        },
        required: ['pickup_id']
      }
    }
  }
};

export { apiTool };