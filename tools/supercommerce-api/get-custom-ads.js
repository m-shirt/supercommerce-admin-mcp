/**
 * Function to get a list of custom ads.
 *
 * @param {Object} params - The parameters for filtering custom ads (currently no filters supported).
 * @returns {Promise<Object>} - The result containing custom ads list.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/custom-ads`;

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
    console.error('Error getting custom ads:', error);
    return { error: error.message || 'An error occurred while fetching custom ads.' };
  }
};

/**
 * Tool configuration for getting custom ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_custom_ads',
      description: 'Get a list of all custom ads in the store front.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };