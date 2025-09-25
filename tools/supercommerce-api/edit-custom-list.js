/**
 * Function to edit an existing custom list.
 *
 * @param {Object} params - The parameters for editing a custom list.
 * @param {string} params.list_id - The ID of the custom list to edit.
 * @param {string} [params.name] - New name of the custom list.
 * @param {string} [params.description] - New description of the custom list.
 * @param {string} [params.type] - New type of the custom list.
 * @param {Array} [params.items] - New array of items for the list.
 * @param {boolean} [params.active] - Whether the list is active.
 * @returns {Promise<Object>} - The result of the custom list update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { list_id, ...updateData } = params;

    const url = `${baseURL}/api/admin/lists/${list_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Only include fields that are provided
    const requestData = {};
    if (updateData.name !== undefined) requestData.name = updateData.name;
    if (updateData.description !== undefined) requestData.description = updateData.description;
    if (updateData.type !== undefined) requestData.type = updateData.type;
    if (updateData.items !== undefined) requestData.items = updateData.items;
    if (updateData.active !== undefined) requestData.active = updateData.active;

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error editing custom list:', error);
    return { error: error.message || 'An error occurred while editing the custom list.' };
  }
};

/**
 * Tool configuration for editing a custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_custom_list',
      description: 'Edit an existing custom list with updated information.',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'The ID of the custom list to edit.'
          },
          name: {
            type: 'string',
            description: 'New name of the custom list.'
          },
          description: {
            type: 'string',
            description: 'New description of the custom list.'
          },
          type: {
            type: 'string',
            description: 'New type of the custom list.'
          },
          items: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'New array of items for the list.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the list is active.'
          }
        },
        required: ['list_id']
      }
    }
  }
};

export { apiTool };