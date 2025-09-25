/**
 * Function to edit custom list.
 *
 * @param {Object} params - The parameters for edit custom list.
 * @param {string} params.list_id - The list id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      list_id,
    } = params;

    let url = `${baseURL}/api/admin/lists/${list_id}`;
    

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
    console.error('Error in editCustomList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_custom_list',
      description: 'Edit Custom List',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'The list id'
          }
        },
        required: ['list_id']
      }
    }
  }
};

export { apiTool };