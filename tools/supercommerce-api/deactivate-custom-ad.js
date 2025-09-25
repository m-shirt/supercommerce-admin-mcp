/**
 * Function to deactivate a custom ad.
 *
 * @param {Object} params - The parameters for deactivating a custom ad.
 * @param {string} params.ad_id - The ID of the custom ad to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the custom ad deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { ad_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/custom-ads/${ad_id}/deactivate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ deactivation_notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deactivating custom ad:', error);
    return { error: error.message || 'An error occurred while deactivating the custom ad.' };
  }
};

/**
 * Tool configuration for deactivating a custom ad.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_custom_ad',
      description: 'Deactivate a custom ad with optional notes.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the custom ad to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['ad_id']
      }
    }
  }
};

export { apiTool };