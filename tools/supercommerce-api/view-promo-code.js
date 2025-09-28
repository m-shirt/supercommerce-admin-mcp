/**
 * Function to view promo code.
 *
 * @param {Object} params - The parameters for view promo code.
 * @param {string} params.promo_id - The promo id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      promo_id,
    } = params;

    let url = `${baseURL}/api/admin/promos/${promo_id}`;
    

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
    console.error('Error in viewPromoCode:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for view promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_promo_code',
      description: 'View Promo Code',
      parameters: {
        type: 'object',
        properties: {
          promo_id: {
            type: 'string',
            description: 'The promo id'
          }
        },
        required: ['promo_id']
      }
    }
  }
};

export { apiTool };