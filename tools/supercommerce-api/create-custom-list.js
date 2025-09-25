/**
 * Function to create custom list.
 *
 * @param {Object} params - The parameters for create custom list.


 * @param {string} [params.name_en] - The name en.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.description_en] - The description en.
 * @param {string} [params.description_ar] - The description ar.
 * @param {string} [params.product_type] - The product type.
 * @param {string} [params.image_en] - The image en.
 * @param {string} [params.image_ar] - The image ar.
 * @param {string} [params.type] - The type.
 * @param {string} [params.list_method] - The list method.
 * @param {string} [params.status] - The status.
 * @param {string} [params.items] - The items.
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
      product_type,
      image_en,
      image_ar,
      type,
      list_method,
      status,
      items,
    } = params;

    const url = `${baseURL}/api/admin/lists`;
    

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
      'product_type': product_type,
      'image_en': image_en,
      'image_ar': image_ar,
      'type': type,
      'list_method': list_method,
      'status': status,
      'items': items,
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
    console.error('Error in createCustomList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_custom_list',
      description: 'Create Custom List',
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
          product_type: {
            type: 'string',
            description: 'The product type'
          },
          image_en: {
            type: 'string',
            description: 'The image en'
          },
          image_ar: {
            type: 'string',
            description: 'The image ar'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          list_method: {
            type: 'string',
            description: 'The list method'
          },
          status: {
            type: 'string',
            description: 'The status'
          },
          items: {
            type: 'string',
            description: 'The items'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };