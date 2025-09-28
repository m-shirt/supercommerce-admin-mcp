/**
 * Function to activate branch.
 *
 * @param {Object} params - The parameters for activate branch.
 * @param {string} params.branch_id - The branch id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      branch_id,
    } = params;

    let url = `${baseURL}/api/admin/branches/${branch_id}/activate`;
    

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
    console.error('Error in activateBranch:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_branch',
      description: 'Activate Branch',
      parameters: {
        type: 'object',
        properties: {
          branch_id: {
            type: 'string',
            description: 'The branch id'
          }
        },
        required: ['branch_id']
      }
    }
  }
};

export { apiTool };