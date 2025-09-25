/**
 * Function to activate ads.
 *
 * @param {Object} params - The parameters for activate ads.
 * @param {string} params.custom_ads_id - The custom-ads id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      custom_ads_id,
    } = params;

    let url = `${baseURL}/api/admin/custom-ads/${custom-ads_id}/activate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in activateAds:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_ads',
      description: 'Activate Ads',
      parameters: {
        type: 'object',
        properties: {
          custom_ads_id: {
            type: 'string',
            description: 'The custom-ads id'
          }
        },
        required: ['custom_ads_id']
      }
    }
  }
};

export { apiTool };