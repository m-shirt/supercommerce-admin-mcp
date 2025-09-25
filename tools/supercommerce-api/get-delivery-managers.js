/**
 * Function to retrieve delivery managers.
 *
 * @param {Object} params - The parameters for retrieving delivery managers.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter delivery managers.
 * @param {string} [params.status] - Filter delivery managers by status (active/inactive).
 * @param {string} [params.city_id] - Filter by city ID.
 * @returns {Promise<Object>} - The list of delivery managers.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page = 1,
      per_page = 15,
      q,
      status,
      city_id
    } = params;

    let url = `${baseURL}/api/admin/v2/deliverers?page=${page}&per_page=${per_page}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (city_id) {
      url += `&city_id=${city_id}`;
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
    console.error('Error retrieving delivery managers:', error);
    return { error: error.message || 'An error occurred while retrieving delivery managers.' };
  }
};

/**
 * Tool configuration for retrieving delivery managers.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_delivery_managers',
      description: 'Retrieve delivery managers with filtering and pagination options.',
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
            description: 'Search query to filter delivery managers by name, email, or phone.'
          },
          status: {
            type: 'string',
            description: 'Filter delivery managers by status (e.g., "active", "inactive").'
          },
          city_id: {
            type: 'string',
            description: 'Filter delivery managers by city ID.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };