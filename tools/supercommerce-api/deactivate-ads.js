/**
 * Function to deactivate ads.
 *
 * @param {Object} params - The parameters for deactivate ads.
 * @param {string} params.custom_ads_id - The custom-ads id.

 * @param {string} [params.deactivation_notes] - The deactivation notes.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      custom_ads_id,
      deactivation_notes,
    } = params;

    let url = `${baseURL}/api/admin/custom-ads/${custom-ads_id}/deactivate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'deactivation_notes': deactivation_notes,
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
    console.error('Error in deactivateAds:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_ads',
      description: 'Deactivate Ads',
      parameters: {
        type: 'object',
        properties: {
          custom_ads_id: {
            type: 'string',
            description: 'The custom-ads id'
          },
          deactivation_notes: {
            type: 'string',
            description: 'The deactivation notes'
          }
        },
        required: ['custom_ads_id']
      }
    }
  }
};

export { apiTool };