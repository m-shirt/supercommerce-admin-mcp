/**
 * Function to deactivate promo code.
 *
 * @param {Object} params - The parameters for deactivate promo code.
 * @param {string} params.promo_id - The promo id.

 * @param {string} [params.deactivation_notes] - The deactivation notes.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      promo_id,
      deactivation_notes,
    } = params;

    let url = `${baseURL}/api/admin/promos/${promo_id}/deactivate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'deactivation_notes': deactivation_notes,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deactivatePromoCode:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_promo_code',
      description: 'Deactivate Promo Code',
      parameters: {
        type: 'object',
        properties: {
          promo_id: {
            type: 'string',
            description: 'The promo id'
          },
          deactivation_notes: {
            type: 'string',
            description: 'The deactivation notes'
          }
        },
        required: ['promo_id']
      }
    }
  }
};

export { apiTool };