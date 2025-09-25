/**
 * Function to update privacy-policy.
 *
 * @param {Object} params - The parameters for update privacy-policy.


 * @param {string} [params.slug] - The slug.
 * @param {string} [params.title_en] - The title en.
 * @param {string} [params.title_ar] - The title ar.
 * @param {string} [params.type] - The type.
 * @param {string} [params.iframe_url_ar] - The iframe url ar.
 * @param {string} [params.iframe_url_en] - The iframe url en.
 * @param {string} [params.content_en] - The content en.
 * @param {string} [params.content_ar] - The content ar.
 * @param {string} [params.order] - The order.
 * @param {string} [params.in_footer] - The in footer.
 * @param {string} [params.show_title] - The show title.
 * @param {string} [params.css_content_en] - The css content en.
 * @param {string} [params.css_content_ar] - The css content ar.
 * @param {string} [params.js_content_en] - The js content en.
 * @param {string} [params.js_content_ar] - The js content ar.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      slug,
      title_en,
      title_ar,
      type,
      iframe_url_ar,
      iframe_url_en,
      content_en,
      content_ar,
      order,
      in_footer,
      show_title,
      css_content_en,
      css_content_ar,
      js_content_en,
      js_content_ar,
    } = params;

    const url = `${baseURL}/api/admin/pages/2/update`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'slug': slug,
      'title_en': title_en,
      'title_ar': title_ar,
      'type': type,
      'iframe_url_ar': iframe_url_ar,
      'iframe_url_en': iframe_url_en,
      'content_en': content_en,
      'content_ar': content_ar,
      'order': order,
      'in_footer': in_footer,
      'show_title': show_title,
      'css_content_en': css_content_en,
      'css_content_ar': css_content_ar,
      'js_content_en': js_content_en,
      'js_content_ar': js_content_ar,
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
    console.error('Error in updatePrivacypolicy:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for update privacy-policy.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_privacypolicy',
      description: 'Update Privacy-Policy',
      parameters: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'The slug'
          },
          title_en: {
            type: 'string',
            description: 'The title en'
          },
          title_ar: {
            type: 'string',
            description: 'The title ar'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          iframe_url_ar: {
            type: 'string',
            description: 'The iframe url ar'
          },
          iframe_url_en: {
            type: 'string',
            description: 'The iframe url en'
          },
          content_en: {
            type: 'string',
            description: 'The content en'
          },
          content_ar: {
            type: 'string',
            description: 'The content ar'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          in_footer: {
            type: 'string',
            description: 'The in footer'
          },
          show_title: {
            type: 'string',
            description: 'The show title'
          },
          css_content_en: {
            type: 'string',
            description: 'The css content en'
          },
          css_content_ar: {
            type: 'string',
            description: 'The css content ar'
          },
          js_content_en: {
            type: 'string',
            description: 'The js content en'
          },
          js_content_ar: {
            type: 'string',
            description: 'The js content ar'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };