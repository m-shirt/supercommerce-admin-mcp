/**
 * Function to get online transactions.
 *
 * @param {Object} params - The parameters for get online transactions.

 * @param {string} [params.q] - q.
 * @param {string} [params.page] - page.
 * @param {string} [params.date_from] - date from.
 * @param {string} [params.date_to] - date to.
 * @param {string} [params.status] - status.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q,
      page,
      date_from,
      date_to,
      status,
    } = params;

    const url = `${baseURL}/api/admin/transactions?q=&page=1&date_from=&date_to=&status=`;
    
    const queryParams = new URLSearchParams();
    if (q !== undefined) queryParams.append('q', q);
    if (page !== undefined) queryParams.append('page', page);
    if (date_from !== undefined) queryParams.append('date_from', date_from);
    if (date_to !== undefined) queryParams.append('date_to', date_to);
    if (status !== undefined) queryParams.append('status', status);
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

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
    console.error('Error in getOnlineTransactions:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get online transactions.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_online_transactions',
      description: 'Get online Transactions',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'q'
          },
          page: {
            type: 'string',
            description: 'page'
          },
          date_from: {
            type: 'string',
            description: 'date from'
          },
          date_to: {
            type: 'string',
            description: 'date to'
          },
          status: {
            type: 'string',
            description: 'status'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };