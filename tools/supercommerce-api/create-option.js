/**
 * Function to create option.
 *
 * @param {Object} params - The parameters for create option.


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

    const url = `${baseURL}/api/admin/options`;
    

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
    console.error('Error in createOption:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create option.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_option',
      description: 'Create Option',
      parameters: {
        type: 'object',
        properties: {
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
        required: []
      }
    }
  }
};

export { apiTool };