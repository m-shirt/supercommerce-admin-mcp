/**
 * Function to edit an existing section.
 *
 * @param {Object} params - The parameters for editing a section.
 * @param {string} params.section_id - The ID of the section to edit.
 * @param {string} [params.name_en] - Updated section name in English.
 * @param {string} [params.name_ar] - Updated section name in Arabic.
 * @param {string} [params.type] - Updated type of section.
 * @param {string} [params.item_id] - Updated ID of the item this section relates to.
 * @param {string} [params.item_parent_id] - Updated parent ID of the item.
 * @param {boolean} [params.show_products] - Whether to show products in this section.
 * @param {number} [params.order] - Updated display order of the section.
 * @param {number} [params.active] - Whether the section is active (1 for active, 0 for inactive).
 * @param {number} [params.image_type] - Updated type of image display.
 * @param {boolean} [params.show_title] - Whether to show the section title.
 * @param {Array} [params.images] - Updated array of images for the section.
 * @param {string} [params.start_date] - Updated start date for the section.
 * @param {string} [params.start_time] - Updated start time for the section.
 * @param {string} [params.end_date] - Updated end date for the section.
 * @param {string} [params.expiration_time] - Updated expiration time for the section.
 * @returns {Promise<Object>} - The result of the section update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { section_id, ...updateData } = params;
    const url = `${baseURL}/api/admin/sections/${section_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Only include fields that are provided
    const requestData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        requestData[key] = updateData[key];
      }
    });

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
    console.error('Error editing section:', error);
    return { error: error.message || 'An error occurred while editing the section.' };
  }
};

/**
 * Tool configuration for editing a section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_section',
      description: 'Edit an existing store front section with updated information.',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The ID of the section to edit.'
          },
          name_en: {
            type: 'string',
            description: 'Updated section name in English.'
          },
          name_ar: {
            type: 'string',
            description: 'Updated section name in Arabic.'
          },
          type: {
            type: 'string',
            description: 'Updated type of section.'
          },
          item_id: {
            type: 'string',
            description: 'Updated ID of the item this section relates to.'
          },
          item_parent_id: {
            type: 'string',
            description: 'Updated parent ID of the item.'
          },
          show_products: {
            type: 'boolean',
            description: 'Whether to show products in this section.'
          },
          order: {
            type: 'integer',
            description: 'Updated display order of the section.',
            minimum: 1
          },
          active: {
            type: 'integer',
            description: 'Whether the section is active (1 for active, 0 for inactive).',
            enum: [0, 1]
          },
          image_type: {
            type: 'integer',
            description: 'Updated type of image display.'
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
            description: 'Updated array of images for the section.'
          },
          start_date: {
            type: 'string',
            description: 'Updated start date for the section (format: YYYY-MM-DD HH:MM).'
          },
          start_time: {
            type: 'string',
            description: 'Updated start time for the section (format: HH:MM).'
          },
          end_date: {
            type: 'string',
            description: 'Updated end date for the section (format: YYYY-MM-DD HH:MM).'
          },
          expiration_time: {
            type: 'string',
            description: 'Updated expiration time for the section (format: HH:MM).'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };