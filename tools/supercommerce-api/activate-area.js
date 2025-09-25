/**
 * Function to activate an area.
 *
 * @param {Object} params - The parameters for activating an area.
 * @param {string} params.city_id - The ID of the governorate.
 * @param {string} params.area_id - The ID of the area to activate.
 * @returns {Promise<Object>} - The result of the area activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { city_id, area_id } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}/areas/${area_id}/activate`;

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
    console.error('Error activating area:', error);
    return { error: error.message || 'An error occurred while activating the area.' };
  }
};

/**
 * Tool configuration for activating an area.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_area',
      description: 'Activate an area to enable delivery services in that location.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate.'
          },
          area_id: {
            type: 'string',
            description: 'The ID of the area to activate.'
          }
        },
        required: ['city_id', 'area_id']
      }
    }
  }
};

export { apiTool };