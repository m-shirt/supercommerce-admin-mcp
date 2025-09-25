/**
 * Function to create a new group.
 *
 * @param {Object} params - The parameters for creating a group.
 * @param {string} params.name_en - Group name in English.
 * @param {string} params.name_ar - Group name in Arabic.
 * @param {string} [params.description_en] - Group description in English.
 * @param {string} [params.description_ar] - Group description in Arabic.
 * @param {string} [params.image] - Image URL for the group.
 * @param {string} params.categories_id - Category ID that this group belongs to.
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
 * @returns {Promise<Object>} - The result of the group creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/groups`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name_en: params.name_en,
      name_ar: params.name_ar,
      description_en: params.description_en || '',
      description_ar: params.description_ar || '',
      image: params.image || '',
      categories_id: params.categories_id,
      sub_categories: params.sub_categories || [],
      order: params.order || 1,
      slug: params.slug || '',
      html_top_en: params.html_top_en || '',
      html_top_ar: params.html_top_ar || '',
      html_bottom_en: params.html_bottom_en || '',
      html_bottom_ar: params.html_bottom_ar || '',
      meta_tag_title_en: params.meta_tag_title_en || '',
      meta_tag_title_ar: params.meta_tag_title_ar || '',
      meta_tag_description_en: params.meta_tag_description_en || '',
      meta_tag_description_ar: params.meta_tag_description_ar || '',
      meta_tag_keywords_en: params.meta_tag_keywords_en || '',
      meta_tag_keywords_ar: params.meta_tag_keywords_ar || '',
      alt: params.alt || '',
      alt_ar: params.alt_ar || ''
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
    console.error('Error creating group:', error);
    return { error: error.message || 'An error occurred while creating the group.' };
  }
};

/**
 * Tool configuration for creating a group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_group',
      description: 'Create a new group with comprehensive details including SEO and categorization.',
      parameters: {
        type: 'object',
        properties: {
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
            type: 'string',
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
        required: ['name_en', 'name_ar', 'categories_id']
      }
    }
  }
};

export { apiTool };