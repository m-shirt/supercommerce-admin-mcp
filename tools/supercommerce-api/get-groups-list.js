/**
 * Function to get a paginated list of groups.
 *
 * @param {Object} params - The parameters for filtering groups.
 * @param {string} [params.q] - Search query for filtering groups.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @returns {Promise<Object>} - The result containing groups list.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { q = '', page = 1 } = params;

    const url = new URL(`${baseURL}/api/admin/v2/groups`);
    url.searchParams.append('q', q);
    url.searchParams.append('page', page.toString());

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting groups list:', error);
    return { error: error.message || 'An error occurred while fetching groups list.' };
  }
};

/**
 * Tool configuration for getting groups list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_groups_list',
      description: 'Get a paginated list of groups with optional search filtering.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query for filtering groups by name or description.'
          },
          page: {
            type: 'integer',
            description: 'Page number for pagination (default: 1).',
            minimum: 1
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };