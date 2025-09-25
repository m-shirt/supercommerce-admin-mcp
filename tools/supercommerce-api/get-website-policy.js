/**
 * Function to get website policy.
 *
 * @param {Object} params - The parameters for get website policy.

 * @param {string} [params.flag] - flag.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      flag,
    } = params;

    const url = `${baseURL}/api/admin/pages?flag=non-general`;
    
    const queryParams = new URLSearchParams();
    if (flag !== undefined) queryParams.append('flag', flag);
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
    console.error('Error in getWebsitePolicy:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get website policy.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_website_policy',
      description: 'Get Website Policy',
      parameters: {
        type: 'object',
        properties: {
          flag: {
            type: 'string',
            description: 'flag'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };