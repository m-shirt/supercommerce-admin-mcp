/**
 * Function to get sliders.
 *
 * @param {Object} params - The parameters for get sliders.

 * @param {string} [params.type] - type.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      type,
    } = params;

    const url = `${baseURL}/api/admin/pages/all?type=landing_page`;
    
    const queryParams = new URLSearchParams();
    if (type !== undefined) queryParams.append('type', type);
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

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
    console.error('Error in getSliders:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get sliders.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_sliders',
      description: 'Get Sliders',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'type'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };