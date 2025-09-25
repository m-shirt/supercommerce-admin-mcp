/**
 * Function to update the cookies policy page.
 *
 * @param {Object} params - The parameters for updating the cookies page.
 * @param {string} [params.slug] - The slug for the page (default: "cookie-policy").
 * @param {string} [params.title_en] - The title in English (default: "Cookie Policy").
 * @param {string} [params.title_ar] - The title in Arabic.
 * @param {string} [params.type] - The type of content (default: "html").
 * @param {string} [params.content_en] - The content in English.
 * @param {string} [params.content_ar] - The content in Arabic.
 * @param {string} [params.iframe_url_en] - Iframe URL for English content.
 * @param {string} [params.iframe_url_ar] - Iframe URL for Arabic content.
 * @param {number} [params.order] - Display order (default: 999).
 * @param {boolean} [params.in_footer] - Whether to show in footer (default: false).
 * @param {boolean} [params.show_title] - Whether to show title (default: false).
 * @param {string} [params.css_content_en] - CSS content for English version.
 * @param {string} [params.css_content_ar] - CSS content for Arabic version.
 * @param {string} [params.js_content_en] - JavaScript content for English version.
 * @param {string} [params.js_content_ar] - JavaScript content for Arabic version.
 * @returns {Promise<Object>} - The result of updating the cookies page.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      slug = "cookie-policy",
      title_en = "Cookie Policy",
      title_ar,
      type = "html",
      content_en,
      content_ar,
      iframe_url_en = null,
      iframe_url_ar = null,
      order = 999,
      in_footer = false,
      show_title = false,
      css_content_en = null,
      css_content_ar = null,
      js_content_en = null,
      js_content_ar = null
    } = params;

    // Using page ID 4 as mentioned in the plan for cookies page
    const url = `${baseURL}/api/admin/pages/4/update`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      slug,
      title_en,
      type,
      iframe_url_en,
      iframe_url_ar,
      order,
      in_footer,
      show_title,
      css_content_en,
      css_content_ar,
      js_content_en,
      js_content_ar,
      ...(title_ar && { title_ar }),
      ...(content_en && { content_en }),
      ...(content_ar && { content_ar })
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
    console.error('Error updating cookies page:', error);
    return { error: error.message || 'An error occurred while updating the cookies page.' };
  }
};

/**
 * Tool configuration for updating cookies page.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_cookies_page',
      description: 'Update the cookies policy page content and settings.',
      parameters: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'The slug for the page (default: "cookie-policy").'
          },
          title_en: {
            type: 'string',
            description: 'The title in English (default: "Cookie Policy").'
          },
          title_ar: {
            type: 'string',
            description: 'The title in Arabic.'
          },
          type: {
            type: 'string',
            description: 'The type of content (default: "html").'
          },
          content_en: {
            type: 'string',
            description: 'The content in English (HTML format).'
          },
          content_ar: {
            type: 'string',
            description: 'The content in Arabic (HTML format).'
          },
          iframe_url_en: {
            type: 'string',
            description: 'Iframe URL for English content.'
          },
          iframe_url_ar: {
            type: 'string',
            description: 'Iframe URL for Arabic content.'
          },
          order: {
            type: 'number',
            description: 'Display order (default: 999).'
          },
          in_footer: {
            type: 'boolean',
            description: 'Whether to show in footer (default: false).'
          },
          show_title: {
            type: 'boolean',
            description: 'Whether to show title (default: false).'
          },
          css_content_en: {
            type: 'string',
            description: 'CSS content for English version.'
          },
          css_content_ar: {
            type: 'string',
            description: 'CSS content for Arabic version.'
          },
          js_content_en: {
            type: 'string',
            description: 'JavaScript content for English version.'
          },
          js_content_ar: {
            type: 'string',
            description: 'JavaScript content for Arabic version.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };