/**
 * Function to new admin.
 *
 * @param {Object} params - The parameters for new admin.


 * @param {string} [params.name] - The name.
 * @param {string} [params.email] - The email.
 * @param {string} [params.role_id] - The role id.
 * @param {string} [params.password] - The password.
 * @param {string} [params.phone] - The phone.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      email,
      role_id,
      password,
      phone,
    } = params;

    const url = `${baseURL}/api/admin/admins`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'email': email,
      'role_id': role_id,
      'password': password,
      'phone': phone,
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
    console.error('Error in newAdmin:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new admin.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_admin',
      description: 'New Admin',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          email: {
            type: 'string',
            description: 'The email'
          },
          role_id: {
            type: 'string',
            description: 'The role id'
          },
          password: {
            type: 'string',
            description: 'The password'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };