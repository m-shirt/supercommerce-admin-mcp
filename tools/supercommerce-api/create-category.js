/**
 * Function to create category.
 *
 * @param {Object} params - The parameters for create category.


 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.image] - The image.
 * @param {string} [params.slug] - The slug.
 * @param {string} [params.description] - The description.
 * @param {string} [params.description_ar] - The description ar.
 * @param {string} [params.order] - The order.
 * @param {string} [params.featured] - The featured.
 * @param {string} [params.sub_categories] - The sub categories.
 * @param {string} [params.html_top_en] - The html top en.
 * @param {string} [params.html_top_ar] - The html top ar.
 * @param {string} [params.html_bottom_en] - The html bottom en.
 * @param {string} [params.html_bottom_ar] - The html bottom ar.
 * @param {string} [params.meta_tag_title_en] - The meta tag title en.
 * @param {string} [params.meta_tag_title_ar] - The meta tag title ar.
 * @param {string} [params.meta_tag_description_en] - The meta tag description en.
 * @param {string} [params.meta_tag_description_ar] - The meta tag description ar.
 * @param {string} [params.meta_tag_keywords_en] - The meta tag keywords en.
 * @param {string} [params.meta_tag_keywords_ar] - The meta tag keywords ar.
 * @param {string} [params.alt] - The alt.
 * @param {string} [params.alt_ar] - The alt ar.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      name_ar,
      image,
      slug,
      description,
      description_ar,
      order,
      featured,
      sub_categories,
      html_top_en,
      html_top_ar,
      html_bottom_en,
      html_bottom_ar,
      meta_tag_title_en,
      meta_tag_title_ar,
      meta_tag_description_en,
      meta_tag_description_ar,
      meta_tag_keywords_en,
      meta_tag_keywords_ar,
      alt,
      alt_ar,
    } = params;

    const url = `${baseURL}/api/admin/categories`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'name_ar': name_ar,
      'image': image,
      'slug': slug,
      'description': description,
      'description_ar': description_ar,
      'order': order,
      'featured': featured,
      'sub_categories': sub_categories,
      'html_top_en': html_top_en,
      'html_top_ar': html_top_ar,
      'html_bottom_en': html_bottom_en,
      'html_bottom_ar': html_bottom_ar,
      'meta_tag_title_en': meta_tag_title_en,
      'meta_tag_title_ar': meta_tag_title_ar,
      'meta_tag_description_en': meta_tag_description_en,
      'meta_tag_description_ar': meta_tag_description_ar,
      'meta_tag_keywords_en': meta_tag_keywords_en,
      'meta_tag_keywords_ar': meta_tag_keywords_ar,
      'alt': alt,
      'alt_ar': alt_ar,
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
    console.error('Error in createCategory:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create category.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_category',
      description: 'Create Category',
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
          image: {
            type: 'string',
            description: 'The image'
          },
          slug: {
            type: 'string',
            description: 'The slug'
          },
          description: {
            type: 'string',
            description: 'The description'
          },
          description_ar: {
            type: 'string',
            description: 'The description ar'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          featured: {
            type: 'string',
            description: 'The featured'
          },
          sub_categories: {
            type: 'string',
            description: 'The sub categories'
          },
          html_top_en: {
            type: 'string',
            description: 'The html top en'
          },
          html_top_ar: {
            type: 'string',
            description: 'The html top ar'
          },
          html_bottom_en: {
            type: 'string',
            description: 'The html bottom en'
          },
          html_bottom_ar: {
            type: 'string',
            description: 'The html bottom ar'
          },
          meta_tag_title_en: {
            type: 'string',
            description: 'The meta tag title en'
          },
          meta_tag_title_ar: {
            type: 'string',
            description: 'The meta tag title ar'
          },
          meta_tag_description_en: {
            type: 'string',
            description: 'The meta tag description en'
          },
          meta_tag_description_ar: {
            type: 'string',
            description: 'The meta tag description ar'
          },
          meta_tag_keywords_en: {
            type: 'string',
            description: 'The meta tag keywords en'
          },
          meta_tag_keywords_ar: {
            type: 'string',
            description: 'The meta tag keywords ar'
          },
          alt: {
            type: 'string',
            description: 'The alt'
          },
          alt_ar: {
            type: 'string',
            description: 'The alt ar'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };