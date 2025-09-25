/**
 * Function to retrieve contact us messages/inquiries.
 *
 * @param {Object} params - The parameters for retrieving contact us messages.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {number} [params.per_page] - Number of items per page (default: 15).
 * @param {string} [params.q] - Search query to filter messages.
 * @param {string} [params.status] - Filter messages by status (e.g., "read", "unread").
 * @param {string} [params.date_from] - Start date for filtering (YYYY-MM-DD).
 * @param {string} [params.date_to] - End date for filtering (YYYY-MM-DD).
 * @returns {Promise<Object>} - The list of contact us messages.
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
      date_from,
      date_to
    } = params;

    let url = `${baseURL}/api/admin/contact_us?page=${page}&per_page=${per_page}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    if (status) {
      url += `&status=${status}`;
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
    console.error('Error retrieving contact us messages:', error);
    return { error: error.message || 'An error occurred while retrieving contact us messages.' };
  }
};

/**
 * Tool configuration for retrieving contact us messages.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_contact_us',
      description: 'Retrieve contact us messages and customer inquiries with filtering options.',
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
            description: 'Search query to filter messages by name, email, or subject.'
          },
          status: {
            type: 'string',
            description: 'Filter messages by status (e.g., "read", "unread", "replied").'
          },
          date_from: {
            type: 'string',
            description: 'Start date for filtering messages (YYYY-MM-DD format).'
          },
          date_to: {
            type: 'string',
            description: 'End date for filtering messages (YYYY-MM-DD format).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };