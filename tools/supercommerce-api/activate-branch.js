/**
 * Function to activate a branch.
 *
 * @param {Object} params - The parameters for activating a branch.
 * @param {string} params.branch_id - The ID of the branch to activate.
 * @returns {Promise<Object>} - The result of the branch activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { branch_id } = params;

    const url = `${baseURL}/api/admin/branches/${branch_id}/activate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating branch:', error);
    return { error: error.message || 'An error occurred while activating the branch.' };
  }
};

/**
 * Tool configuration for activating a branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_branch',
      description: 'Activate a branch by its ID.',
      parameters: {
        type: 'object',
        properties: {
          branch_id: {
            type: 'string',
            description: 'The ID of the branch to activate.'
          }
        },
        required: ['branch_id']
      }
    }
  }
};

export { apiTool };