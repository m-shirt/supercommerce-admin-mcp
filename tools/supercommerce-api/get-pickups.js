/**
 * Function to retrieve pickup orders and delivery information.
 *
 * @param {Object} params - The parameters for retrieving pickups.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter pickups.
 * @param {string} [params.status] - Filter pickups by delivery status.
 * @param {string} [params.delivery_date] - Filter by delivery date (YYYY-MM-DD).
 * @param {string} [params.deliverer_id] - Filter by deliverer ID.
 * @returns {Promise<Object>} - The list of pickup orders.
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
      delivery_date,
      deliverer_id
    } = params;

    let url = `${baseURL}/api/admin/pickups?page=${page}&per_page=${per_page}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (delivery_date) {
      url += `&delivery_date=${delivery_date}`;
    }

    if (deliverer_id) {
      url += `&deliverer_id=${deliverer_id}`;
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
    console.error('Error retrieving pickups:', error);
    return { error: error.message || 'An error occurred while retrieving pickups.' };
  }
};

/**
 * Tool configuration for retrieving pickups.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_pickups',
      description: 'Retrieve pickup orders and delivery information with filtering options.',
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
            description: 'Search query to filter pickups by order reference or customer.'
          },
          status: {
            type: 'string',
            description: 'Filter pickups by delivery status (e.g., "pending", "assigned", "delivered").'
          },
          delivery_date: {
            type: 'string',
            description: 'Filter by delivery date (YYYY-MM-DD format).'
          },
          deliverer_id: {
            type: 'string',
            description: 'Filter by deliverer ID to see orders assigned to specific deliverer.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };