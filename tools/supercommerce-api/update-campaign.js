/**
 * Function to update campaign.
 *
 * @param {Object} params - The parameters for update campaign.


 * @param {string} [params.utm_campaign] - The utm campaign.
 * @param {string} [params.name] - The name.
 * @param {string} [params.expired_at] - The expired at.
 * @param {string} [params.click_expire_hours] - The click expire hours.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      utm_campaign,
      name,
      expired_at,
      click_expire_hours,
    } = params;

    const url = `${baseURL}/api/admin/campaigns/3/update/`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'utm_campaign': utm_campaign,
      'name': name,
      'expired_at': expired_at,
      'click_expire_hours': click_expire_hours,
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
    console.error('Error in updateCampaign:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for update campaign.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_campaign',
      description: 'Update Campaign',
      parameters: {
        type: 'object',
        properties: {
          utm_campaign: {
            type: 'string',
            description: 'The utm campaign'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          expired_at: {
            type: 'string',
            description: 'The expired at'
          },
          click_expire_hours: {
            type: 'string',
            description: 'The click expire hours'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };