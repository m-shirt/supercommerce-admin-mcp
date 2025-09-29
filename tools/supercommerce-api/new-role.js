/**
 * Function to new role.
 *
 * @param {Object} params - The parameters for new role.


 * @param {string} [params.name] - The name.
 * @param {string} [params.order_states] - The order states.
 * @param {string} [params.permissions] - The permissions.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      order_states,
      permissions,
    } = params;

    const url = `${baseURL}/api/admin/roles`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'order_states': order_states,
      'permissions': permissions,
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
    console.error('Error in newRole:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new role.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_role',
      description: 'New Role',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          order_states: {
            type: 'string',
            description: 'The order states'
          },
          permissions: {
            type: 'string',
            description: 'The permissions'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };