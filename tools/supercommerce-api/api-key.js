/**
 * Function to api key.
 *
 * @param {Object} params - The parameters for api key.



 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {

    } = params;

    const url = `${baseURL}/api/tenant/api_tokens`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in apiKey:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for api key.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'api_key',
      description: 'Api Key',
      parameters: {
        type: 'object',
        properties: {

        },
        required: []
      }
    }
  }
};

export { apiTool };