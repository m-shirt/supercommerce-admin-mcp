/**
 * Function to new area.
 *
 * @param {Object} params - The parameters for new area.


 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.fees_text_en] - The fees text en.
 * @param {string} [params.fees_text_ar] - The fees text ar.
 * @param {string} [params.order] - The order.
 * @param {string} [params.minimum_for_free_delivery] - The minimum for free delivery.
 * @param {string} [params.maximum_weight_for_free_delivery] - The maximum weight for free delivery.
 * @param {string} [params.minimum_override_provider] - The minimum override provider.
 * @param {string} [params.aramex_area_name] - The aramex area name.
 * @param {string} [params.delivery_fees] - The delivery fees.
 * @param {string} [params.fees_type] - The fees type.
 * @param {string} [params.coordinates] - The coordinates.
 * @param {string} [params.override_delivery_fees_on_selected_districts] - The override delivery fees on selected districts.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      name_ar,
      fees_text_en,
      fees_text_ar,
      order,
      minimum_for_free_delivery,
      maximum_weight_for_free_delivery,
      minimum_override_provider,
      aramex_area_name,
      delivery_fees,
      fees_type,
      coordinates,
      override_delivery_fees_on_selected_districts,
    } = params;

    const url = `${baseURL}/api/admin/cities/10/areas`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'name_ar': name_ar,
      'fees_text_en': fees_text_en,
      'fees_text_ar': fees_text_ar,
      'order': order,
      'minimum_for_free_delivery': minimum_for_free_delivery,
      'maximum_weight_for_free_delivery': maximum_weight_for_free_delivery,
      'minimum_override_provider': minimum_override_provider,
      'aramex_area_name': aramex_area_name,
      'delivery_fees': delivery_fees,
      'fees_type': fees_type,
      'coordinates': coordinates,
      'override_delivery_fees_on_selected_districts': override_delivery_fees_on_selected_districts,
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
    console.error('Error in newArea:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new area.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_area',
      description: 'New Area',
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
          fees_text_en: {
            type: 'string',
            description: 'The fees text en'
          },
          fees_text_ar: {
            type: 'string',
            description: 'The fees text ar'
          },
          order: {
            type: 'string',
            description: 'The order'
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
          aramex_area_name: {
            type: 'string',
            description: 'The aramex area name'
          },
          delivery_fees: {
            type: 'string',
            description: 'The delivery fees'
          },
          fees_type: {
            type: 'string',
            description: 'The fees type'
          },
          coordinates: {
            type: 'string',
            description: 'The coordinates'
          },
          override_delivery_fees_on_selected_districts: {
            type: 'string',
            description: 'The override delivery fees on selected districts'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };