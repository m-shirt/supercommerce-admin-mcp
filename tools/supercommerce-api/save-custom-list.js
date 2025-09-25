/**
 * Function to save changes to a custom list.
 *
 * @param {Object} params - The parameters for saving a custom list.
 * @param {string} params.list_id - The ID of the custom list to save.
 * @param {Object} [params.data] - The data to save to the custom list.
 * @returns {Promise<Object>} - The result of the custom list save operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { list_id, data = {} } = params;

    const url = `${baseURL}/api/admin/lists/${list_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving custom list:', error);
    return { error: error.message || 'An error occurred while saving the custom list.' };
  }
};

/**
 * Tool configuration for saving a custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_custom_list',
      description: 'Save changes to a custom list.',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'The ID of the custom list to save.'
          },
          data: {
            type: 'object',
            description: 'The data to save to the custom list.'
          }
        },
        required: ['list_id']
      }
    }
  }
};

export { apiTool };