/**
 * Function to delete a custom list.
 *
 * @param {Object} params - The parameters for deleting a custom list.
 * @param {string} params.list_id - The ID of the custom list to delete.
 * @returns {Promise<Object>} - The result of the custom list deletion.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { list_id } = params;

    const url = `${baseURL}/api/admin/lists/${list_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting custom list:', error);
    return { error: error.message || 'An error occurred while deleting the custom list.' };
  }
};

/**
 * Tool configuration for deleting a custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_custom_list',
      description: 'Delete a custom list by its ID.',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'The ID of the custom list to delete.'
          }
        },
        required: ['list_id']
      }
    }
  }
};

export { apiTool };