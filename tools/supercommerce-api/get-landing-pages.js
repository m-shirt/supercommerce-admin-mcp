/**
 * Function to get all landing pages.
 *
 * @param {Object} params - The parameters for filtering landing pages.
 * @param {string} [params.type] - Type of pages to retrieve (default: "landing_page").
 * @returns {Promise<Object>} - The result containing landing pages list.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { type = 'landing_page' } = params;

    const url = new URL(`${baseURL}/api/admin/pages/all`);
    url.searchParams.append('type', type);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting landing pages:', error);
    return { error: error.message || 'An error occurred while fetching landing pages.' };
  }
};

/**
 * Tool configuration for getting landing pages.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_landing_pages',
      description: 'Get all landing pages from the admin system.',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Type of pages to retrieve (default: "landing_page").'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };