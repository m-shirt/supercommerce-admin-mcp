/**
 * Function to get contact us.
 *
 * @param {Object} params - The parameters for get contact us.

 * @param {string} [params.page] - page.
 * @param {string} [params.q] - q.
 * @param {string} [params.id] - id.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
      q,
      id,
    } = params;

    let url = `${baseURL}/api/admin/contact_us?page=1&q=&id=`;
    
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page);
    if (q !== undefined) queryParams.append('q', q);
    if (id !== undefined) queryParams.append('id', id);
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
    console.error('Error in getContactUs:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get contact us.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_contact_us',
      description: 'Get Contact Us',
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
          id: {
            type: 'string',
            description: 'id'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };