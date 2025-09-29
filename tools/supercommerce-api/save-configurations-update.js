/**
 * Function to save configurations update.
 *
 * @param {Object} params - The parameters for save configurations update.


 * @param {string} [params.configs] - The configs.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      configs,
    } = params;

    const url = `${baseURL}/api/admin/configurations/manager/update`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'configs': configs,
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
    console.error('Error in saveConfigurationsUpdate:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for save configurations update.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_configurations_update',
      description: 'Save Configurations Update',
      parameters: {
        type: 'object',
        properties: {
          configs: {
            type: 'string',
            description: 'The configs'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };