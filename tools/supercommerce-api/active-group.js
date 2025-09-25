/**
 * Function to active group.
 *
 * @param {Object} params - The parameters for active group.
 * @param {string} params.group_id - The group id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      group_id,
    } = params;

    let url = `${baseURL}/api/admin/groups/${group_id}/activate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in activeGroup:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for active group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'active_group',
      description: 'Active Group',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The group id'
          }
        },
        required: ['group_id']
      }
    }
  }
};

export { apiTool };