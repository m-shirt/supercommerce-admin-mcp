/**
 * Function to deactivate customer.
 *
 * @param {Object} params - The parameters for deactivate customer.
 * @param {string} params.cutomer_id - The cutomer id.

 * @param {string} [params.deactivation_notes] - The deactivation notes.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      cutomer_id,
      deactivation_notes,
    } = params;

    let url = `${baseURL}/api/admin/customers/${cutomer_id}/deactivate`;
    

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
    console.error('Error in deactivateCustomer:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_customer',
      description: 'Deactivate Customer',
      parameters: {
        type: 'object',
        properties: {
          cutomer_id: {
            type: 'string',
            description: 'The cutomer id'
          },
          deactivation_notes: {
            type: 'string',
            description: 'The deactivation notes'
          }
        },
        required: ['cutomer_id']
      }
    }
  }
};

export { apiTool };