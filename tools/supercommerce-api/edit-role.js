/**
 * Function to edit role.
 *
 * @param {Object} params - The parameters for edit role.
 * @param {string} params.role_id - The role id.

 * @param {string} [params.id] - The id.
 * @param {string} [params.name] - The name.
 * @param {string} [params.permissions] - The permissions.
 * @param {string} [params.order_states] - The order states.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      role_id,
      id,
      name,
      permissions,
      order_states,
    } = params;

    let url = `${baseURL}/api/admin/roles/${role_id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'id': id,
      'name': name,
      'permissions': permissions,
      'order_states': order_states,
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
    console.error('Error in editRole:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit role.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_role',
      description: 'Edit Role',
      parameters: {
        type: 'object',
        properties: {
          role_id: {
            type: 'string',
            description: 'The role id'
          },
          id: {
            type: 'string',
            description: 'The id'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          permissions: {
            type: 'string',
            description: 'The permissions'
          },
          order_states: {
            type: 'string',
            description: 'The order states'
          }
        },
        required: ['role_id']
      }
    }
  }
};

export { apiTool };