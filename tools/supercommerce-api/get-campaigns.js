/**
 * Function to retrieve all campaigns.
 *
 * @param {Object} params - The parameters for retrieving campaigns.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter campaigns.
 * @param {string} [params.status] - Filter campaigns by status (e.g., "active", "inactive").
 * @returns {Promise<Object>} - The list of campaigns.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page = 1, per_page = 15, q, status } = params;

    let url = `${baseURL}/api/admin/campaigns?page=${page}&per_page=${per_page}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    if (status) {
      url += `&status=${status}`;
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
    console.error('Error retrieving campaigns:', error);
    return { error: error.message || 'An error occurred while retrieving campaigns.' };
  }
};

/**
 * Tool configuration for retrieving campaigns.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_campaigns',
      description: 'Retrieve all campaigns with optional filtering and pagination.',
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
          },
          q: {
            type: 'string',
            description: 'Search query to filter campaigns by name or description.'
          },
          status: {
            type: 'string',
            description: 'Filter campaigns by status (e.g., "active", "inactive").'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };