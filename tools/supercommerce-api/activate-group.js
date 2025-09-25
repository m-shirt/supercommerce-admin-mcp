/**
 * Function to activate a group.
 *
 * @param {Object} params - The parameters for activating a group.
 * @param {string} params.group_id - The ID of the group to activate.
 * @returns {Promise<Object>} - The result of the group activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { group_id } = params;

    const url = `${baseURL}/api/admin/groups/${group_id}/activate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating group:', error);
    return { error: error.message || 'An error occurred while activating the group.' };
  }
};

/**
 * Tool configuration for activating a group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_group',
      description: 'Activate a group by its ID.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to activate.'
          }
        },
        required: ['group_id']
      }
    }
  }
};

export { apiTool };