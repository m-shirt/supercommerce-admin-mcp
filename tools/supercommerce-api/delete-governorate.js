/**
 * Function to delete governorate.
 *
 * @param {Object} params - The parameters for delete governorate.
 * @param {string} params.governorate_id - The governorate id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      governorate_id,
    } = params;

    let url = `${baseURL}/api/admin/cities/${governorate_id}`;
    

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
    console.error('Error in deleteGovernorate:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for delete governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_governorate',
      description: 'Delete Governorate',
      parameters: {
        type: 'object',
        properties: {
          governorate_id: {
            type: 'string',
            description: 'The governorate id'
          }
        },
        required: ['governorate_id']
      }
    }
  }
};

export { apiTool };