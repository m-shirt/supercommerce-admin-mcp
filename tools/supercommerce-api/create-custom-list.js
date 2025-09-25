/**
 * Function to create a new custom list.
 *
 * @param {Object} params - The parameters for creating a custom list.
 * @param {string} params.name - Name of the custom list.
 * @param {string} [params.description] - Description of the custom list.
 * @param {string} [params.type] - Type of the custom list.
 * @param {Array} [params.items] - Array of items to include in the list.
 * @param {boolean} [params.active] - Whether the list is active (default: true).
 * @returns {Promise<Object>} - The result of the custom list creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/lists`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name: params.name,
      description: params.description || '',
      type: params.type || 'custom',
      items: params.items || [],
      active: params.active !== undefined ? params.active : true
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
    console.error('Error creating custom list:', error);
    return { error: error.message || 'An error occurred while creating the custom list.' };
  }
};

/**
 * Tool configuration for creating a custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_custom_list',
      description: 'Create a new custom list for organizing products or content.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the custom list.'
          },
          description: {
            type: 'string',
            description: 'Description of the custom list.'
          },
          type: {
            type: 'string',
            description: 'Type of the custom list.'
          },
          items: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Array of items to include in the list.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the list is active (default: true).'
          }
        },
        required: ['name']
      }
    }
  }
};

export { apiTool };