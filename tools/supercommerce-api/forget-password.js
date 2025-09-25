/**
 * Function to forget password.
 *
 * @param {Object} params - The parameters for forget password.


 * @param {string} [params.email] - The email.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      email,
    } = params;

    const url = `${baseURL}/api/admin//auth/forget_password`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'email': email,
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
    console.error('Error in forgetPassword:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for forget password.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'forget_password',
      description: 'Forget Password',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };