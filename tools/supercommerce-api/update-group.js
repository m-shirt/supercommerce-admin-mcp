/**
 * Function to update an existing group.
 *
 * @param {Object} params - The parameters for updating a group.
 * @param {string} params.group_id - The ID of the group to update.
 * @param {number} [params.id] - Internal ID of the group.
 * @param {string} params.name_en - Group name in English.
 * @param {string} params.name_ar - Group name in Arabic.
 * @param {string} [params.description_en] - Group description in English.
 * @param {string} [params.description_ar] - Group description in Arabic.
 * @param {string} [params.image] - Image URL for the group.
 * @param {string|number} params.categories_id - Category ID that this group belongs to.
 * @param {Array<number>} [params.sub_categories] - Array of subcategory IDs.
 * @param {number} [params.order] - Display order for the group.
 * @param {string} [params.slug] - URL slug for the group.
 * @param {string} [params.html_top_en] - HTML content at top in English.
 * @param {string} [params.html_top_ar] - HTML content at top in Arabic.
 * @param {string} [params.html_bottom_en] - HTML content at bottom in English.
 * @param {string} [params.html_bottom_ar] - HTML content at bottom in Arabic.
 * @param {string} [params.meta_tag_title_en] - SEO meta title in English.
 * @param {string} [params.meta_tag_title_ar] - SEO meta title in Arabic.
 * @param {string} [params.meta_tag_description_en] - SEO meta description in English.
 * @param {string} [params.meta_tag_description_ar] - SEO meta description in Arabic.
 * @param {string} [params.meta_tag_keywords_en] - SEO meta keywords in English.
 * @param {string} [params.meta_tag_keywords_ar] - SEO meta keywords in Arabic.
 * @param {string} [params.alt] - Alt text for image in English.
 * @param {string} [params.alt_ar] - Alt text for image in Arabic.
 * @returns {Promise<Object>} - The result of the group update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { group_id, ...updateData } = params;
    const url = `${baseURL}/api/admin/groups/${group_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      id: updateData.id || parseInt(group_id),
      name_en: updateData.name_en,
      name_ar: updateData.name_ar,
      description_en: updateData.description_en || '',
      description_ar: updateData.description_ar || '',
      image: updateData.image || '',
      categories_id: updateData.categories_id,
      sub_categories: updateData.sub_categories || [],
      order: updateData.order || 1,
      slug: updateData.slug || '',
      html_top_en: updateData.html_top_en || '',
      html_top_ar: updateData.html_top_ar || '',
      html_bottom_en: updateData.html_bottom_en || '',
      html_bottom_ar: updateData.html_bottom_ar || '',
      meta_tag_title_en: updateData.meta_tag_title_en || '',
      meta_tag_title_ar: updateData.meta_tag_title_ar || '',
      meta_tag_description_en: updateData.meta_tag_description_en || '',
      meta_tag_description_ar: updateData.meta_tag_description_ar || '',
      meta_tag_keywords_en: updateData.meta_tag_keywords_en || '',
      meta_tag_keywords_ar: updateData.meta_tag_keywords_ar || '',
      alt: updateData.alt || '',
      alt_ar: updateData.alt_ar || ''
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
    console.error('Error updating group:', error);
    return { error: error.message || 'An error occurred while updating the group.' };
  }
};

/**
 * Tool configuration for updating a group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_group',
      description: 'Update an existing group with comprehensive details including SEO and categorization.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to update.'
          },
          id: {
            type: 'integer',
            description: 'Internal ID of the group (optional, will use group_id if not provided).'
          },
          name_en: {
            type: 'string',
            description: 'Group name in English.'
          },
          name_ar: {
            type: 'string',
            description: 'Group name in Arabic.'
          },
          description_en: {
            type: 'string',
            description: 'Group description in English.'
          },
          description_ar: {
            type: 'string',
            description: 'Group description in Arabic.'
          },
          image: {
            type: 'string',
            description: 'Image URL for the group.'
          },
          categories_id: {
            type: 'integer',
            description: 'Category ID that this group belongs to.'
          },
          sub_categories: {
            type: 'array',
            items: {
              type: 'integer'
            },
            description: 'Array of subcategory IDs.'
          },
          order: {
            type: 'integer',
            description: 'Display order for the group.'
          },
          slug: {
            type: 'string',
            description: 'URL slug for the group.'
          },
          html_top_en: {
            type: 'string',
            description: 'HTML content at top in English.'
          },
          html_top_ar: {
            type: 'string',
            description: 'HTML content at top in Arabic.'
          },
          html_bottom_en: {
            type: 'string',
            description: 'HTML content at bottom in English.'
          },
          html_bottom_ar: {
            type: 'string',
            description: 'HTML content at bottom in Arabic.'
          },
          meta_tag_title_en: {
            type: 'string',
            description: 'SEO meta title in English.'
          },
          meta_tag_title_ar: {
            type: 'string',
            description: 'SEO meta title in Arabic.'
          },
          meta_tag_description_en: {
            type: 'string',
            description: 'SEO meta description in English.'
          },
          meta_tag_description_ar: {
            type: 'string',
            description: 'SEO meta description in Arabic.'
          },
          meta_tag_keywords_en: {
            type: 'string',
            description: 'SEO meta keywords in English.'
          },
          meta_tag_keywords_ar: {
            type: 'string',
            description: 'SEO meta keywords in Arabic.'
          },
          alt: {
            type: 'string',
            description: 'Alt text for image in English.'
          },
          alt_ar: {
            type: 'string',
            description: 'Alt text for image in Arabic.'
          }
        },
        required: ['group_id', 'name_en', 'name_ar', 'categories_id']
      }
    }
  }
};

export { apiTool };