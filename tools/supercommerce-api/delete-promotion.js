/**
 * Function to delete promotion.
 *
 * @param {Object} params - The parameters for delete promotion.
 * @param {string} params.promotion_id - The promotion id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      promotion_id,
    } = params;

    let url = `${baseURL}/api/admin/promotions/${promotion_id}`;
    

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
    console.error('Error in deletePromotion:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for delete promotion.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_promotion',
      description: 'Delete Promotion',
      parameters: {
        type: 'object',
        properties: {
          promotion_id: {
            type: 'string',
            description: 'The promotion id'
          }
        },
        required: ['promotion_id']
      }
    }
  }
};

export { apiTool };