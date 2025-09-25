/**
 * Function to update the terms and conditions page.
 *
 * @param {Object} params - The parameters for updating the terms page.
 * @param {string} params.title - The title of the terms page.
 * @param {string} params.content - The content/body of the terms page.
 * @param {string} [params.meta_title] - Optional meta title for SEO.
 * @param {string} [params.meta_description] - Optional meta description for SEO.
 * @param {string} [params.meta_keywords] - Optional meta keywords for SEO.
 * @returns {Promise<Object>} - The result of the terms page update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { title, content, meta_title, meta_description, meta_keywords } = params;

    const url = `${baseURL}/api/admin/pages/1/update`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      title,
      content,
      ...(meta_title && { meta_title }),
      ...(meta_description && { meta_description }),
      ...(meta_keywords && { meta_keywords })
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
    console.error('Error updating terms page:', error);
    return { error: error.message || 'An error occurred while updating the terms page.' };
  }
};

/**
 * Tool configuration for updating the terms page.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_terms_page',
      description: 'Update the terms and conditions page content and metadata.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the terms page.'
          },
          content: {
            type: 'string',
            description: 'The main content/body of the terms page.'
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
          }
        },
        required: ['title', 'content']
      }
    }
  }
};

export { apiTool };