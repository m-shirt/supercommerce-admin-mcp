/**
 * Function to retrieve all pages.
 *
 * @param {Object} params - The parameters for retrieving pages.
 * @param {string} [params.flag] - Optional flag to filter pages (e.g., "general").
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @returns {Promise<Object>} - The list of pages.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { flag, page = 1, per_page = 15 } = params;

    let url = `${baseURL}/api/admin/pages?page=${page}&per_page=${per_page}`;

    if (flag) {
      url += `&flag=${flag}`;
    }

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
    console.error('Error retrieving pages:', error);
    return { error: error.message || 'An error occurred while retrieving pages.' };
  }
};

/**
 * Tool configuration for retrieving pages.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_pages',
      description: 'Retrieve all pages with optional filtering and pagination.',
      parameters: {
        type: 'object',
        properties: {
          flag: {
            type: 'string',
            description: 'Filter pages by flag (e.g., "general" for general pages).'
          },
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