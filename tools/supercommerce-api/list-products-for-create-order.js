/**
 * Function to list products for create order.
 *
 * @param {Object} params - The parameters for list products for create order.
 * @param {string} params.keyword - The keyword.
 * @param {string} params.user_id - The user id.
 * @param {string} params.address_id - The address id.
 * @param {string} [params.q] - q.
 * @param {string} [params.variant] - variant.
 * @param {string} [params.user_id] - user id.
 * @param {string} [params.address_id] - address id.
 * @param {string} [params.page] - page.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      keyword,
      user_id,
      address_id,
      q,
      variant,
      page,
    } = params;

    let url = `${baseURL}/api/admin/v2/dropdown/products?q=${keyword}&variant=1&user_id=${user_id}&address_id=${address_id}&page=1`;
    
    const queryParams = new URLSearchParams();
    if (q !== undefined) queryParams.append('q', q);
    if (variant !== undefined) queryParams.append('variant', variant);
    if (user_id !== undefined) queryParams.append('user_id', user_id);
    if (address_id !== undefined) queryParams.append('address_id', address_id);
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
    console.error('Error in listProductsForCreateOrder:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for list products for create order.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_products_for_create_order',
      description: 'List Products For Create Order',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'The keyword'
          },
          user_id: {
            type: 'string',
            description: 'The user id'
          },
          address_id: {
            type: 'string',
            description: 'The address id'
          },
          q: {
            type: 'string',
            description: 'q'
          },
          variant: {
            type: 'string',
            description: 'variant'
          },
          page: {
            type: 'string',
            description: 'page'
          }
        },
        required: ['keyword', 'user_id', 'address_id']
      }
    }
  }
};

export { apiTool };