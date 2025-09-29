/**
 * Function to activate role.
 *
 * @param {Object} params - The parameters for activate role.
 * @param {string} params.role_id - The role id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      role_id,
    } = params;

    let url = `${baseURL}/api/admin/roles/${role_id}/activate`;
    

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
    console.error('Error in activateRole:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate role.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_role',
      description: 'Activate Role',
      parameters: {
        type: 'object',
        properties: {
          role_id: {
            type: 'string',
            description: 'The role id'
          }
        },
        required: ['role_id']
      }
    }
  }
};

export { apiTool };