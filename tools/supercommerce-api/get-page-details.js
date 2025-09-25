/**
 * Function to retrieve detailed information about a specific page.
 *
 * @param {Object} params - The parameters for retrieving page details.
 * @param {string} params.page_id - The ID of the page to retrieve.
 * @returns {Promise<Object>} - The detailed page information.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page_id } = params;

    const url = `${baseURL}/api/admin/pages/${page_id}/show`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving page details:', error);
    return { error: error.message || 'An error occurred while retrieving page details.' };
  }
};

/**
 * Tool configuration for retrieving page details.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_page_details',
      description: 'Retrieve detailed information about a specific page.',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The ID of the page to retrieve details for.'
          }
        },
        required: ['page_id']
      }
    }
  }
};

export { apiTool };