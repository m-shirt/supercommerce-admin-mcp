/**
 * Function to create a new page.
 *
 * @param {Object} params - The parameters for creating a new page.
 * @param {string} params.title - The title of the page.
 * @param {string} params.content - The content/body of the page.
 * @param {string} [params.slug] - Optional URL slug for the page.
 * @param {string} [params.meta_title] - Optional meta title for SEO.
 * @param {string} [params.meta_description] - Optional meta description for SEO.
 * @param {string} [params.meta_keywords] - Optional meta keywords for SEO.
 * @param {boolean} [params.is_active] - Whether the page should be active (default: true).
 * @param {string} [params.page_type] - Type of the page (e.g., "general").
 * @returns {Promise<Object>} - The result of the page creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      title,
      content,
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      is_active = true,
      page_type
    } = params;

    const url = `${baseURL}/api/admin/pages/store`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      title,
      content,
      is_active,
      ...(slug && { slug }),
      ...(meta_title && { meta_title }),
      ...(meta_description && { meta_description }),
      ...(meta_keywords && { meta_keywords }),
      ...(page_type && { page_type })
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
    console.error('Error creating page:', error);
    return { error: error.message || 'An error occurred while creating the page.' };
  }
};

/**
 * Tool configuration for creating a page.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_page',
      description: 'Create a new page with title, content, and optional metadata.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the page.'
          },
          content: {
            type: 'string',
            description: 'The main content/body of the page.'
          },
          slug: {
            type: 'string',
            description: 'Optional URL slug for the page (auto-generated if not provided).'
          },
          meta_title: {
            type: 'string',
            description: 'Optional meta title for SEO purposes.'
          },
          meta_description: {
            type: 'string',
            description: 'Optional meta description for SEO purposes.'
          },
          meta_keywords: {
            type: 'string',
            description: 'Optional meta keywords for SEO purposes.'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the page should be active (default: true).'
          },
          page_type: {
            type: 'string',
            description: 'Type of the page (e.g., "general").'
          }
        },
        required: ['title', 'content']
      }
    }
  }
};

export { apiTool };