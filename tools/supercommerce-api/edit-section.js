/**
 * Function to edit section.
 *
 * @param {Object} params - The parameters for edit section.
 * @param {string} params.section_id - The section id.

 * @param {string} [params.name_en] - The name en.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.type] - The type.
 * @param {string} [params.item_id] - The item id.
 * @param {string} [params.item_parent_id] - The item parent id.
 * @param {string} [params.show_products] - The show products.
 * @param {string} [params.order] - The order.
 * @param {string} [params.active] - The active.
 * @param {string} [params.image_type] - The image type.
 * @param {string} [params.show_title] - The show title.
 * @param {string} [params.images] - The images.
 * @param {string} [params.start_date] - The start date.
 * @param {string} [params.start_time] - The start time.
 * @param {string} [params.end_date] - The end date.
 * @param {string} [params.expiration_time] - The expiration time.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      section_id,
      name_en,
      name_ar,
      type,
      item_id,
      item_parent_id,
      show_products,
      order,
      active,
      image_type,
      show_title,
      images,
      start_date,
      start_time,
      end_date,
      expiration_time,
    } = params;

    let url = `${baseURL}/api/admin/sections/${section_id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name_en': name_en,
      'name_ar': name_ar,
      'type': type,
      'item_id': item_id,
      'item_parent_id': item_parent_id,
      'show_products': show_products,
      'order': order,
      'active': active,
      'image_type': image_type,
      'show_title': show_title,
      'images': images,
      'start_date': start_date,
      'start_time': start_time,
      'end_date': end_date,
      'expiration_time': expiration_time,
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
    console.error('Error in editSection:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_section',
      description: 'Edit Section',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The section id'
          },
          name_en: {
            type: 'string',
            description: 'The name en'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          item_id: {
            type: 'string',
            description: 'The item id'
          },
          item_parent_id: {
            type: 'string',
            description: 'The item parent id'
          },
          show_products: {
            type: 'string',
            description: 'The show products'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          active: {
            type: 'string',
            description: 'The active'
          },
          image_type: {
            type: 'string',
            description: 'The image type'
          },
          show_title: {
            type: 'string',
            description: 'The show title'
          },
          images: {
            type: 'string',
            description: 'The images'
          },
          start_date: {
            type: 'string',
            description: 'The start date'
          },
          start_time: {
            type: 'string',
            description: 'The start time'
          },
          end_date: {
            type: 'string',
            description: 'The end date'
          },
          expiration_time: {
            type: 'string',
            description: 'The expiration time'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };