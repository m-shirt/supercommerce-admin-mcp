/**
 * Function to get delivery managers.
 *
 * @param {Object} params - The parameters for get delivery managers.

 * @param {string} [params.q] - q.
 * @param {string} [params.page] - page.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q,
      page,
    } = params;

    const url = `${baseURL}/api/admin/v2/deliverers?q=&page=1`;
    
    const queryParams = new URLSearchParams();
    if (q !== undefined) queryParams.append('q', q);
    if (page !== undefined) queryParams.append('page', page);
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
    console.error('Error in getDeliveryManagers:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get delivery managers.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_delivery_managers',
      description: 'Get Delivery Managers',
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
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };