/**
 * Function to view customer.
 *
 * @param {Object} params - The parameters for view customer.
 * @param {string} params.cutomer_id - The cutomer id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      cutomer_id,
    } = params;

    let url = `${baseURL}/api/admin/customers/${cutomer_id}`;
    

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
    console.error('Error in viewCustomer:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for view customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_customer',
      description: 'View Customer',
      parameters: {
        type: 'object',
        properties: {
          cutomer_id: {
            type: 'string',
            description: 'The cutomer id'
          }
        },
        required: ['cutomer_id']
      }
    }
  }
};

export { apiTool };