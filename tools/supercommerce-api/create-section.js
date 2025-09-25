/**
 * Function to create a new section.
 *
 * @param {Object} params - The parameters for creating a section.
 * @param {string} params.name_en - Section name in English.
 * @param {string} params.name_ar - Section name in Arabic.
 * @param {string} params.type - Type of section (e.g., "2" for category-based).
 * @param {string} [params.item_id] - ID of the item this section relates to.
 * @param {string} [params.item_parent_id] - Parent ID of the item.
 * @param {boolean} [params.show_products] - Whether to show products in this section.
 * @param {number} [params.order] - Display order of the section.
 * @param {number} [params.active] - Whether the section is active (1 for active, 0 for inactive).
 * @param {number} [params.image_type] - Type of image display (1 for single image).
 * @param {boolean} [params.show_title] - Whether to show the section title.
 * @param {Array} [params.images] - Array of images for the section.
 * @param {string} [params.start_date] - Start date for the section (format: YYYY-MM-DD HH:MM).
 * @param {string} [params.start_time] - Start time for the section (format: HH:MM).
 * @param {string} [params.end_date] - End date for the section (format: YYYY-MM-DD HH:MM).
 * @param {string} [params.expiration_time] - Expiration time for the section (format: HH:MM).
 * @returns {Promise<Object>} - The result of the section creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/sections`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name_en: params.name_en,
      name_ar: params.name_ar,
      type: params.type,
      item_id: params.item_id || '',
      item_parent_id: params.item_parent_id || '',
      show_products: params.show_products !== undefined ? params.show_products : true,
      order: params.order || 1,
      active: params.active !== undefined ? params.active : 1,
      image_type: params.image_type || 1,
      show_title: params.show_title !== undefined ? params.show_title : true,
      images: params.images || [],
      start_date: params.start_date || '',
      start_time: params.start_time || '',
      end_date: params.end_date || '',
      expiration_time: params.expiration_time || ''
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
    console.error('Error creating section:', error);
    return { error: error.message || 'An error occurred while creating the section.' };
  }
};

/**
 * Tool configuration for creating a section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_section',
      description: 'Create a new store front section with comprehensive configuration options.',
      parameters: {
        type: 'object',
        properties: {
          name_en: {
            type: 'string',
            description: 'Section name in English.'
          },
          name_ar: {
            type: 'string',
            description: 'Section name in Arabic.'
          },
          type: {
            type: 'string',
            description: 'Type of section (e.g., "2" for category-based).'
          },
          item_id: {
            type: 'string',
            description: 'ID of the item this section relates to.'
          },
          item_parent_id: {
            type: 'string',
            description: 'Parent ID of the item.'
          },
          show_products: {
            type: 'boolean',
            description: 'Whether to show products in this section.'
          },
          order: {
            type: 'integer',
            description: 'Display order of the section.',
            minimum: 1
          },
          active: {
            type: 'integer',
            description: 'Whether the section is active (1 for active, 0 for inactive).',
            enum: [0, 1]
          },
          image_type: {
            type: 'integer',
            description: 'Type of image display (1 for single image).'
          },
          show_title: {
            type: 'boolean',
            description: 'Whether to show the section title.'
          },
          images: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Array of images for the section.'
          },
          start_date: {
            type: 'string',
            description: 'Start date for the section (format: YYYY-MM-DD HH:MM).'
          },
          start_time: {
            type: 'string',
            description: 'Start time for the section (format: HH:MM).'
          },
          end_date: {
            type: 'string',
            description: 'End date for the section (format: YYYY-MM-DD HH:MM).'
          },
          expiration_time: {
            type: 'string',
            description: 'Expiration time for the section (format: HH:MM).'
          }
        },
        required: ['name_en', 'name_ar', 'type']
      }
    }
  }
};

export { apiTool };