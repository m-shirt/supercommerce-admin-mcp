/**
 * Function to retrieve detailed information about a specific campaign.
 *
 * @param {Object} params - The parameters for retrieving campaign details.
 * @param {string} params.campaign_id - The ID of the campaign to retrieve.
 * @returns {Promise<Object>} - The detailed campaign information.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { campaign_id } = params;

    const url = `${baseURL}/api/admin/campaigns/${campaign_id}`;

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
    console.error('Error retrieving campaign details:', error);
    return { error: error.message || 'An error occurred while retrieving campaign details.' };
  }
};

/**
 * Tool configuration for retrieving campaign details.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_campaign_details',
      description: 'Retrieve detailed information about a specific campaign.',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to retrieve details for.'
          }
        },
        required: ['campaign_id']
      }
    }
  }
};

export { apiTool };