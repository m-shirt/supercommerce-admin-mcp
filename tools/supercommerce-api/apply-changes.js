/**
 * Function to apply changes.
 *
 * @param {Object} params - The parameters for apply changes.


 * @param {string} [params.menu] - The menu.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      menu,
    } = params;

    const url = `${baseURL}/api/admin/menu`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'menu': menu,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in applyChanges:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for apply changes.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'apply_changes',
      description: 'Apply Changes',
      parameters: {
        type: 'object',
        properties: {
          menu: {
            type: 'string',
            description: 'The menu'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };