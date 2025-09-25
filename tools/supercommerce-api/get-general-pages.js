/**
 * Function to retrieve general pages (filtered by flag=general).
 *
 * @param {Object} params - The parameters for retrieving general pages.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @returns {Promise<Object>} - The list of general pages.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page = 1, per_page = 15 } = params;

    const url = `${baseURL}/api/admin/pages?flag=general&page=${page}&per_page=${per_page}`;

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
    console.error('Error retrieving general pages:', error);
    return { error: error.message || 'An error occurred while retrieving general pages.' };
  }
};

/**
 * Tool configuration for retrieving general pages.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_general_pages',
      description: 'Retrieve general pages (filtered by flag=general) with pagination.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
            description: 'Page number for pagination (default: 1).'
          },
          per_page: {
            type: 'number',
            description: 'Number of items per page (default: 15).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };