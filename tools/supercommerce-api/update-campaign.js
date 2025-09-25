/**
 * Function to update an existing campaign.
 *
 * @param {Object} params - The parameters for updating a campaign.
 * @param {string} params.campaign_id - The ID of the campaign to update.
 * @param {string} [params.name] - The name of the campaign.
 * @param {string} [params.description] - The description of the campaign.
 * @param {string} [params.start_date] - The start date of the campaign (YYYY-MM-DD format).
 * @param {string} [params.end_date] - The end date of the campaign (YYYY-MM-DD format).
 * @param {string} [params.discount_type] - Type of discount (e.g., "percentage", "fixed").
 * @param {number} [params.discount_value] - The discount value.
 * @param {number} [params.minimum_order_amount] - Minimum order amount to apply campaign.
 * @param {number} [params.maximum_discount] - Maximum discount amount.
 * @param {number} [params.usage_limit] - Maximum number of times the campaign can be used.
 * @param {boolean} [params.is_active] - Whether the campaign is active.
 * @returns {Promise<Object>} - The result of the campaign update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      campaign_id,
      name,
      description,
      start_date,
      end_date,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount,
      usage_limit,
      is_active
    } = params;

    const url = `${baseURL}/api/admin/campaigns/${campaign_id}/update`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {};

    if (name !== undefined) requestData.name = name;
    if (description !== undefined) requestData.description = description;
    if (start_date !== undefined) requestData.start_date = start_date;
    if (end_date !== undefined) requestData.end_date = end_date;
    if (discount_type !== undefined) requestData.discount_type = discount_type;
    if (discount_value !== undefined) requestData.discount_value = discount_value;
    if (minimum_order_amount !== undefined) requestData.minimum_order_amount = minimum_order_amount;
    if (maximum_discount !== undefined) requestData.maximum_discount = maximum_discount;
    if (usage_limit !== undefined) requestData.usage_limit = usage_limit;
    if (is_active !== undefined) requestData.is_active = is_active;

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating campaign:', error);
    return { error: error.message || 'An error occurred while updating the campaign.' };
  }
};

/**
 * Tool configuration for updating a campaign.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_campaign',
      description: 'Update an existing campaign with new information.',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to update.'
          },
          name: {
            type: 'string',
            description: 'The name of the campaign.'
          },
          description: {
            type: 'string',
            description: 'The description of the campaign.'
          },
          start_date: {
            type: 'string',
            description: 'The start date of the campaign (YYYY-MM-DD format).'
          },
          end_date: {
            type: 'string',
            description: 'The end date of the campaign (YYYY-MM-DD format).'
          },
          discount_type: {
            type: 'string',
            description: 'Type of discount (e.g., "percentage", "fixed").'
          },
          discount_value: {
            type: 'number',
            description: 'The discount value (percentage or fixed amount).'
          },
          minimum_order_amount: {
            type: 'number',
            description: 'Minimum order amount required to apply the campaign.'
          },
          maximum_discount: {
            type: 'number',
            description: 'Maximum discount amount that can be applied.'
          },
          usage_limit: {
            type: 'number',
            description: 'Maximum number of times the campaign can be used.'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the campaign should be active.'
          }
        },
        required: ['campaign_id']
      }
    }
  }
};

export { apiTool };