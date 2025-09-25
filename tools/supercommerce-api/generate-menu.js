/**
 * Function to generate menu automatically based on existing content.
 *
 * @param {Object} params - The parameters for generating menu.
 * @param {boolean} [params.include_categories] - Whether to include product categories in menu.
 * @param {boolean} [params.include_pages] - Whether to include static pages in menu.
 * @param {number} [params.max_items] - Maximum number of items to include in generated menu.
 * @param {string} [params.sort_by] - Sort criteria for menu items (e.g., "name", "popularity").
 * @returns {Promise<Object>} - The result of the menu generation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      include_categories = true,
      include_pages = true,
      max_items,
      sort_by = 'name'
    } = params;

    const url = `${baseURL}/api/admin/menu/generate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      include_categories,
      include_pages,
      sort_by,
      ...(max_items && { max_items })
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
    console.error('Error generating menu:', error);
    return { error: error.message || 'An error occurred while generating the menu.' };
  }
};

/**
 * Tool configuration for generating menu.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'generate_menu',
      description: 'Automatically generate menu based on existing categories and pages.',
      parameters: {
        type: 'object',
        properties: {
          include_categories: {
            type: 'boolean',
            description: 'Whether to include product categories in the generated menu (default: true).'
          },
          include_pages: {
            type: 'boolean',
            description: 'Whether to include static pages in the generated menu (default: true).'
          },
          max_items: {
            type: 'number',
            description: 'Maximum number of items to include in the generated menu.'
          },
          sort_by: {
            type: 'string',
            description: 'Sort criteria for menu items (e.g., "name", "popularity", default: "name").'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };