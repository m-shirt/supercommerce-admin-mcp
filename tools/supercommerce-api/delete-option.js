/**
 * Function to delete an option.
 *
 * @param {Object} params - The parameters for deleting an option.
 * @param {string} params.option_id - The ID of the option to delete.
 * @returns {Promise<Object>} - The result of deleting the option.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { option_id } = params;

    const url = `${baseURL}/api/admin/options/${option_id}`;

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
    console.error('Error deleting option:', error);
    return { error: error.message || 'An error occurred while deleting the option.' };
  }
};

/**
 * Tool configuration for deleting options.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_option',
      description: 'Delete an option by its ID. This is a permanent action that cannot be undone.',
      parameters: {
        type: 'object',
        properties: {
          option_id: {
            type: 'string',
            description: 'The ID of the option to delete.'
          }
        },
        required: ['option_id']
      }
    }
  }
};

export { apiTool };