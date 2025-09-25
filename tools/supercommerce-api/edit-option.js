/**
 * Function to edit option.
 *
 * @param {Object} params - The parameters for edit option.
 * @param {string} params.option_id - The option id.

 * @param {string} [params.name_en] - The name en.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.description_en] - The description en.
 * @param {string} [params.description_ar] - The description ar.
 * @param {string} [params.appear_in_search] - The appear in search.
 * @param {string} [params.preview_type] - The preview type.
 * @param {string} [params.type] - The type.
 * @param {string} [params.order] - The order.
 * @param {string} [params.values] - The values.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      option_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      appear_in_search,
      preview_type,
      type,
      order,
      values,
    } = params;

    let url = `${baseURL}/api/admin/options/${option_id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name_en': name_en,
      'name_ar': name_ar,
      'description_en': description_en,
      'description_ar': description_ar,
      'appear_in_search': appear_in_search,
      'preview_type': preview_type,
      'type': type,
      'order': order,
      'values': values,
    };

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in editOption:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit option.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_option',
      description: 'Edit Option',
      parameters: {
        type: 'object',
        properties: {
          option_id: {
            type: 'string',
            description: 'The option id'
          },
          name_en: {
            type: 'string',
            description: 'The name en'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          description_en: {
            type: 'string',
            description: 'The description en'
          },
          description_ar: {
            type: 'string',
            description: 'The description ar'
          },
          appear_in_search: {
            type: 'string',
            description: 'The appear in search'
          },
          preview_type: {
            type: 'string',
            description: 'The preview type'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          values: {
            type: 'string',
            description: 'The values'
          }
        },
        required: ['option_id']
      }
    }
  }
};

export { apiTool };