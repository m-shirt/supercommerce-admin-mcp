/**
 * Function to get options list paginated.
 *
 * @param {Object} params - The parameters for get options list paginated.

 * @param {string} [params.page] - page.
 * @param {string} [params.q] - q.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
      q,
    } = params;

    const url = `${baseURL}/api/admin/options?page=1&q=`;
    
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page);
    if (q !== undefined) queryParams.append('q', q);
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
    console.error('Error in getOptionsListPaginated:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get options list paginated.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_options_list_paginated',
      description: 'Get Options List Paginated',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'page'
          },
          q: {
            type: 'string',
            description: 'q'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };