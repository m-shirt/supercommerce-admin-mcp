/**
 * Function to update the menu configuration.
 *
 * @param {Object} params - The parameters for updating menu.
 * @param {Array} params.menu_items - Array of menu items with their configuration.
 * @param {Object} [params.menu_settings] - Optional menu display settings.
 * @returns {Promise<Object>} - The result of the menu update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { menu_items, menu_settings } = params;

    const url = `${baseURL}/api/admin/menu`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      menu_items,
      ...(menu_settings && { menu_settings })
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
    console.error('Error updating menu:', error);
    return { error: error.message || 'An error occurred while updating the menu.' };
  }
};

/**
 * Tool configuration for updating menu.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_menu',
      description: 'Update the menu configuration with new items and settings.',
      parameters: {
        type: 'object',
        properties: {
          menu_items: {
            type: 'array',
            description: 'Array of menu items with their configuration (title, url, order, etc.).',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Menu item title' },
                url: { type: 'string', description: 'Menu item URL' },
                order: { type: 'number', description: 'Display order' },
                is_active: { type: 'boolean', description: 'Whether the item is active' }
              }
            }
          },
          menu_settings: {
            type: 'object',
            description: 'Optional menu display settings and configuration.'
          }
        },
        required: ['menu_items']
      }
    }
  }
};

export { apiTool };