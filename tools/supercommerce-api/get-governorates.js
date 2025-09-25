/**
 * Function to retrieve governorates (cities).
 *
 * @param {Object} params - The parameters for retrieving governorates.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter governorates.
 * @param {string} [params.status] - Filter governorates by status (active/inactive).
 * @returns {Promise<Object>} - The list of governorates.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page = 1,
      per_page = 15,
      q,
      status
    } = params;

    let url = `${baseURL}/api/admin/cities?page=${page}&per_page=${per_page}`;

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
    console.error('Error retrieving governorates:', error);
    return { error: error.message || 'An error occurred while retrieving governorates.' };
  }
};

/**
 * Tool configuration for retrieving governorates.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_governorates',
      description: 'Retrieve governorates (cities) with filtering and pagination options.',
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
            description: 'Search query to filter governorates by name.'
          },
          status: {
            type: 'string',
            description: 'Filter governorates by status (e.g., "active", "inactive").'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };