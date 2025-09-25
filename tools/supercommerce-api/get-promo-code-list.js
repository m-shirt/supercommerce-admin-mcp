/**
 * Function to get promo code list.
 *
 * @param {Object} params - The parameters for get promo code list.

 * @param {string} [params.page] - page.
 * @param {string} [params.q] - q.
 * @param {string} [params.mode] - mode.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
      q,
      mode,
    } = params;

    const url = `${baseURL}/api/admin/promos?page=1&q=&mode=promocode`;
    
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page);
    if (q !== undefined) queryParams.append('q', q);
    if (mode !== undefined) queryParams.append('mode', mode);
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
    console.error('Error in getPromoCodeList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get promo code list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_promo_code_list',
      description: 'Get Promo Code List',
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
          },
          mode: {
            type: 'string',
            description: 'mode'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };