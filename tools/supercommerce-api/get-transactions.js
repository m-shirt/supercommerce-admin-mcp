/**
 * Function to retrieve online transactions.
 *
 * @param {Object} params - The parameters for retrieving transactions.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter transactions.
 * @param {string} [params.status] - Filter transactions by status.
 * @param {string} [params.payment_method] - Filter by payment method.
 * @param {string} [params.date_from] - Start date for filtering (YYYY-MM-DD).
 * @param {string} [params.date_to] - End date for filtering (YYYY-MM-DD).
 * @returns {Promise<Object>} - The list of transactions.
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
      payment_method,
      date_from,
      date_to
    } = params;

    let url = `${baseURL}/api/admin/transactions?page=${page}&per_page=${per_page}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (payment_method) {
      url += `&payment_method=${payment_method}`;
    }

    if (date_from) {
      url += `&date_from=${date_from}`;
    }

    if (date_to) {
      url += `&date_to=${date_to}`;
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
    console.error('Error retrieving transactions:', error);
    return { error: error.message || 'An error occurred while retrieving transactions.' };
  }
};

/**
 * Tool configuration for retrieving transactions.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_transactions',
      description: 'Retrieve online transactions with filtering and pagination options.',
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
            description: 'Search query to filter transactions by reference or customer.'
          },
          status: {
            type: 'string',
            description: 'Filter transactions by status (e.g., "completed", "pending", "failed").'
          },
          payment_method: {
            type: 'string',
            description: 'Filter transactions by payment method.'
          },
          date_from: {
            type: 'string',
            description: 'Start date for filtering transactions (YYYY-MM-DD format).'
          },
          date_to: {
            type: 'string',
            description: 'End date for filtering transactions (YYYY-MM-DD format).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };