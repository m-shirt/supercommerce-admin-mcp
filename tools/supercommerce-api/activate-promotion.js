/**
 * Function to activate promotion.
 *
 * @param {Object} params - The parameters for activate promotion.
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

    let url = `${baseURL}/api/admin/promotions/${promotion_id}/activate`;
    

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
    console.error('Error in activatePromotion:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate promotion.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_promotion',
      description: 'Activate Promotion',
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