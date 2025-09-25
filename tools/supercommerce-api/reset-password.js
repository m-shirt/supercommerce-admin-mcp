/**
 * Function to reset password.
 *
 * @param {Object} params - The parameters for reset password.


 * @param {string} [params.password] - The password.
 * @param {string} [params.password_confirm] - The password confirm.
 * @param {string} [params.token] - The token.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      password,
      password_confirm,
      token,
    } = params;

    const url = `${baseURL}/api/admin//auth/reset_password`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'password': password,
      'password_confirm': password_confirm,
      'token': token,
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
    console.error('Error in resetPassword:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for reset password.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'reset_password',
      description: 'Reset Password',
      parameters: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
            description: 'The password'
          },
          password_confirm: {
            type: 'string',
            description: 'The password confirm'
          },
          token: {
            type: 'string',
            description: 'The token'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };