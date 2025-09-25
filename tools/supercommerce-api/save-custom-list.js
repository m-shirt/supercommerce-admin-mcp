/**
 * Function to save custom list.
 *
 * @param {Object} params - The parameters for save custom list.
 * @param {string} params.list_id - The list id.

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
 * @param {string} [params.slug] - The slug.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      list_id,
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
      slug,
    } = params;

    let url = `${baseURL}/api/admin/lists/${list_id}`;
    

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
      'slug': slug,
    };

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
    console.error('Error in saveCustomList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for save custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_custom_list',
      description: 'Save Custom List',
      parameters: {
        type: 'object',
        properties: {
          list_id: {
            type: 'string',
            description: 'The list id'
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
          },
          slug: {
            type: 'string',
            description: 'The slug'
          }
        },
        required: ['list_id']
      }
    }
  }
};

export { apiTool };