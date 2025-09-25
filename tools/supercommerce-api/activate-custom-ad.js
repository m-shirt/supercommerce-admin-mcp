/**
 * Function to activate a custom ad.
 *
 * @param {Object} params - The parameters for activating a custom ad.
 * @param {string} params.ad_id - The ID of the custom ad to activate.
 * @returns {Promise<Object>} - The result of the custom ad activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { ad_id } = params;

    const url = `${baseURL}/api/admin/custom-ads/${ad_id}/activate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating custom ad:', error);
    return { error: error.message || 'An error occurred while activating the custom ad.' };
  }
};

/**
 * Tool configuration for activating a custom ad.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_custom_ad',
      description: 'Activate a custom ad by its ID.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the custom ad to activate.'
          }
        },
        required: ['ad_id']
      }
    }
  }
};

export { apiTool };