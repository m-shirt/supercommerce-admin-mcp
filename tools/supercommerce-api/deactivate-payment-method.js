/**
 * Function to deactivate payment method.
 *
 * @param {Object} params - The parameters for deactivate payment method.
 * @param {string} params.payment_id - The payment id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      payment_id,
    } = params;

    let url = `${baseURL}/api/admin/payment_methods/${payment_id}/deactivate`;
    

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
    console.error('Error in deactivatePaymentMethod:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate payment method.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_payment_method',
      description: 'Deactivate Payment Method',
      parameters: {
        type: 'object',
        properties: {
          payment_id: {
            type: 'string',
            description: 'The payment id'
          }
        },
        required: ['payment_id']
      }
    }
  }
};

export { apiTool };