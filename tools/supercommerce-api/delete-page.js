/**
 * Function to delete a page.
 *
 * @param {Object} params - The parameters for deleting a page.
 * @param {string} params.page_id - The ID of the page to delete.
 * @returns {Promise<Object>} - The result of the page deletion.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { page_id } = params;

    const url = `${baseURL}/api/admin/pages/${page_id}/delete`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting page:', error);
    return { error: error.message || 'An error occurred while deleting the page.' };
  }
};

/**
 * Tool configuration for deleting a page.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_page',
      description: 'Delete a page by its ID.',
      parameters: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The ID of the page to delete.'
          }
        },
        required: ['page_id']
      }
    }
  }
};

export { apiTool };