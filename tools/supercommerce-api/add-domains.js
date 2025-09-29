/**
 * Function to add domains.
 *
 * @param {Object} params - The parameters for add domains.


 * @param {string} [params.domain] - The domain.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      domain,
    } = params;

    const url = `${baseURL}/api/admin/domains`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'domain': domain,
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
    console.error('Error in addDomains:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for add domains.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_domains',
      description: 'Add Domains',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'The domain'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };