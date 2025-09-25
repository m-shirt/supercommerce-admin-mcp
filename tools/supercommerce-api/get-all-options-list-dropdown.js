/**
 * Function to get all options list (dropdown).
 *
 * @param {Object} params - The parameters for get all options list (dropdown).

 * @param {string} [params.active] - active.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      active,
    } = params;

    const url = `${baseURL}/api/admin/options?active=1`;
    
    const queryParams = new URLSearchParams();
    if (active !== undefined) queryParams.append('active', active);
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
    console.error('Error in getAllOptionsListDropdown:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get all options list (dropdown).
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_all_options_list_dropdown',
      description: 'Get All Options List (Dropdown)',
      parameters: {
        type: 'object',
        properties: {
          active: {
            type: 'string',
            description: 'active'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };