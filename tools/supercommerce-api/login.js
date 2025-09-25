/**
 * Function to login.
 *
 * @param {Object} params - The parameters for login.


 * @param {string} [params.email] - The email.
 * @param {string} [params.password] - The password.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      email,
      password,
    } = params;

    const url = `${baseURL}/api/admin/auth`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'email': email,
      'password': password,
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
    console.error('Error in login:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for login.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'login',
      description: 'Login',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email'
          },
          password: {
            type: 'string',
            description: 'The password'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };