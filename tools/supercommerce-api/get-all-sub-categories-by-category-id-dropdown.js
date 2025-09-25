/**
 * Function to get all  sub-categories by category id (dropdown).
 *
 * @param {Object} params - The parameters for get all  sub-categories by category id (dropdown).
 * @param {string} params.category_id - The category id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      category_id,
    } = params;

    let url = `${baseURL}/api/admin/v2/dropdown/categories/${category_id}/subcategories`;
    

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
    console.error('Error in getAllSubcategoriesByCategoryIdDropdown:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get all  sub-categories by category id (dropdown).
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_all_subcategories_by_category_id_dropdown',
      description: 'Get All  Sub-Categories by Category id (Dropdown)',
      parameters: {
        type: 'object',
        properties: {
          category_id: {
            type: 'string',
            description: 'The category id'
          }
        },
        required: ['category_id']
      }
    }
  }
};

export { apiTool };