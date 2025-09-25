/**
 * Function to delete a campaign.
 *
 * @param {Object} params - The parameters for deleting a campaign.
 * @param {string} params.campaign_id - The ID of the campaign to delete.
 * @returns {Promise<Object>} - The result of the campaign deletion.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { campaign_id } = params;

    const url = `${baseURL}/api/admin/campaigns/${campaign_id}/delete`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return { error: error.message || 'An error occurred while deleting the campaign.' };
  }
};

/**
 * Tool configuration for deleting a campaign.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_campaign',
      description: 'Delete a campaign by its ID.',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to delete.'
          }
        },
        required: ['campaign_id']
      }
    }
  }
};

export { apiTool };