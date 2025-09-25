/**
 * Function to new governorate.
 *
 * @param {Object} params - The parameters for new governorate.


 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.order] - The order.
 * @param {string} [params.fees_text_en] - The fees text en.
 * @param {string} [params.fees_text_ar] - The fees text ar.
 * @param {string} [params.delivery_fees] - The delivery fees.
 * @param {string} [params.minimum_for_free_delivery] - The minimum for free delivery.
 * @param {string} [params.maximum_weight_for_free_delivery] - The maximum weight for free delivery.
 * @param {string} [params.minimum_override_provider] - The minimum override provider.
 * @param {string} [params.fees_type] - The fees type.
 * @param {string} [params.minimum_create_order] - The minimum create order.
 * @param {string} [params.override_delivery_fees_on_selected_areas] - The override delivery fees on selected areas.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      name_ar,
      order,
      fees_text_en,
      fees_text_ar,
      delivery_fees,
      minimum_for_free_delivery,
      maximum_weight_for_free_delivery,
      minimum_override_provider,
      fees_type,
      minimum_create_order,
      override_delivery_fees_on_selected_areas,
    } = params;

    const url = `${baseURL}/api/admin/cities`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'name_ar': name_ar,
      'order': order,
      'fees_text_en': fees_text_en,
      'fees_text_ar': fees_text_ar,
      'delivery_fees': delivery_fees,
      'minimum_for_free_delivery': minimum_for_free_delivery,
      'maximum_weight_for_free_delivery': maximum_weight_for_free_delivery,
      'minimum_override_provider': minimum_override_provider,
      'fees_type': fees_type,
      'minimum_create_order': minimum_create_order,
      'override_delivery_fees_on_selected_areas': override_delivery_fees_on_selected_areas,
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
    console.error('Error in newGovernorate:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_governorate',
      description: 'New Governorate',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          fees_text_en: {
            type: 'string',
            description: 'The fees text en'
          },
          fees_text_ar: {
            type: 'string',
            description: 'The fees text ar'
          },
          delivery_fees: {
            type: 'string',
            description: 'The delivery fees'
          },
          minimum_for_free_delivery: {
            type: 'string',
            description: 'The minimum for free delivery'
          },
          maximum_weight_for_free_delivery: {
            type: 'string',
            description: 'The maximum weight for free delivery'
          },
          minimum_override_provider: {
            type: 'string',
            description: 'The minimum override provider'
          },
          fees_type: {
            type: 'string',
            description: 'The fees type'
          },
          minimum_create_order: {
            type: 'string',
            description: 'The minimum create order'
          },
          override_delivery_fees_on_selected_areas: {
            type: 'string',
            description: 'The override delivery fees on selected areas'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };