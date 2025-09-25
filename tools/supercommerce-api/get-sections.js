/**
 * Function to get a paginated list of sections.
 *
 * @param {Object} params - The parameters for filtering sections.
 * @param {number} [params.page] - Page number for pagination (default: 1).
 * @param {string} [params.q] - Search query for filtering sections.
 * @returns {Promise<Object>} - The result containing sections list.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page = 1, q = '' } = params;

    const url = new URL(`${baseURL}/api/admin/sections`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('q', q);

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
    console.error('Error getting sections:', error);
    return { error: error.message || 'An error occurred while fetching sections.' };
  }
};

/**
 * Tool configuration for getting sections.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_sections',
      description: 'Get a paginated list of store front sections with optional search filtering.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Page number for pagination (default: 1).',
            minimum: 1
          },
          q: {
            type: 'string',
            description: 'Search query for filtering sections by name or description.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };