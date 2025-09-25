/**
 * Function to delete a brand.
 *
 * @param {Object} params - The parameters for deleting a brand.
 * @param {string} params.brand_id - The ID of the brand to delete.
 * @returns {Promise<Object>} - The result of deleting the brand.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { brand_id } = params;

    const url = `${baseURL}/api/admin/brands/${brand_id}`;

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
    console.error('Error deleting brand:', error);
    return { error: error.message || 'An error occurred while deleting the brand.' };
  }
};

/**
 * Tool configuration for deleting brands.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_brand',
      description: 'Delete a brand by its ID. This is a permanent action that cannot be undone.',
      parameters: {
        type: 'object',
        properties: {
          brand_id: {
            type: 'string',
            description: 'The ID of the brand to delete.'
          }
        },
        required: ['brand_id']
      }
    }
  }
};

export { apiTool };