/**
 * Function to retrieve the current menu configuration.
 *
 * @param {Object} params - The parameters for retrieving menu.
 * @returns {Promise<Object>} - The current menu configuration.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/menu`;

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
    console.error('Error retrieving menu:', error);
    return { error: error.message || 'An error occurred while retrieving the menu.' };
  }
};

/**
 * Tool configuration for retrieving menu.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_menu',
      description: 'Retrieve the current menu configuration and structure.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };