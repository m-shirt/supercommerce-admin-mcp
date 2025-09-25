/**
 * Function to create a new campaign.
 *
 * @param {Object} params - The parameters for creating a campaign.
 * @param {string} params.name - The name of the campaign.
 * @param {string} params.description - The description of the campaign.
 * @param {string} params.start_date - The start date of the campaign (YYYY-MM-DD format).
 * @param {string} params.end_date - The end date of the campaign (YYYY-MM-DD format).
 * @param {string} [params.discount_type] - Type of discount (e.g., "percentage", "fixed").
 * @param {number} [params.discount_value] - The discount value.
 * @param {number} [params.minimum_order_amount] - Minimum order amount to apply campaign.
 * @param {number} [params.maximum_discount] - Maximum discount amount.
 * @param {number} [params.usage_limit] - Maximum number of times the campaign can be used.
 * @param {boolean} [params.is_active] - Whether the campaign is active (default: true).
 * @returns {Promise<Object>} - The result of the campaign creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      description,
      start_date,
      end_date,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount,
      usage_limit,
      is_active = true
    } = params;

    const url = `${baseURL}/api/admin/campaigns`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name,
      description,
      start_date,
      end_date,
      is_active,
      ...(discount_type && { discount_type }),
      ...(discount_value && { discount_value }),
      ...(minimum_order_amount && { minimum_order_amount }),
      ...(maximum_discount && { maximum_discount }),
      ...(usage_limit && { usage_limit })
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
    console.error('Error creating campaign:', error);
    return { error: error.message || 'An error occurred while creating the campaign.' };
  }
};

/**
 * Tool configuration for creating a campaign.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_campaign',
      description: 'Create a new marketing campaign with discount settings and date range.',
      parameters: {
        type: 'object',
        properties: {
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
            description: 'Whether the campaign should be active (default: true).'
          }
        },
        required: ['name', 'description', 'start_date', 'end_date']
      }
    }
  }
};

export { apiTool };