/**
 * Function to activate a governorate.
 *
 * @param {Object} params - The parameters for activating a governorate.
 * @param {string} params.city_id - The ID of the governorate to activate.
 * @returns {Promise<Object>} - The result of the governorate activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { city_id } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}/activate`;

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
    console.error('Error activating governorate:', error);
    return { error: error.message || 'An error occurred while activating the governorate.' };
  }
};

/**
 * Tool configuration for activating a governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_governorate',
      description: 'Activate a governorate to enable delivery services in that area.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate to activate.'
          }
        },
        required: ['city_id']
      }
    }
  }
};

export { apiTool };