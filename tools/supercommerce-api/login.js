/**
 * Function to log in to the backend API.
 *
 * @param {Object} args - Arguments for the login.
 * @param {string} args.email - The email address of the user.
 * @param {string} args.password - The password of the user.
 * @returns {Promise<Object>} - The result of the login attempt.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const { email, password } = params;
  try {
    // Construct the URL for the login endpoint
    const url = `${baseURL}/api/admin/auth`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
    };

    // Prepare the body of the request
    const body = JSON.stringify({ email, password });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    return { error: error.message || 'An error occurred while logging in.' };
  }
};

/**
 * Tool configuration for logging in to the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'admin_login',
      description: 'Admin login authentication to the backend API.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email address of the user.'
          },
          password: {
            type: 'string',
            description: 'The password of the user.'
          }
        },
        required: ['email', 'password']
      }
    }
  }
};

export { apiTool };