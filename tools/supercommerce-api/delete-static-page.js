/**
 * Function to delete static page.
 *
 * @param {Object} params - The parameters for delete static page.
 * @param {string} params.static_page_id - The static-page id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      static_page_id,
    } = params;

    let url = `${baseURL}/api/admin/pages/${static_page_id}/delete`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteStaticPage:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for delete static page.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_static_page',
      description: 'Delete Static Page',
      parameters: {
        type: 'object',
        properties: {
          static_page_id: {
            type: 'string',
            description: 'The static-page id'
          }
        },
        required: ['static_page_id']
      }
    }
  }
};

export { apiTool };