/**
 * Function to delete a branch.
 *
 * @param {Object} params - The parameters for deleting a branch.
 * @param {string} params.branch_id - The ID of the branch to delete.
 * @returns {Promise<Object>} - The result of the branch deletion.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { branch_id } = params;

    const url = `${baseURL}/api/admin/branches/${branch_id}/delete`;

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
    console.error('Error deleting branch:', error);
    return { error: error.message || 'An error occurred while deleting the branch.' };
  }
};

/**
 * Tool configuration for deleting a branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_branch',
      description: 'Delete a branch by its ID.',
      parameters: {
        type: 'object',
        properties: {
          branch_id: {
            type: 'string',
            description: 'The ID of the branch to delete.'
          }
        },
        required: ['branch_id']
      }
    }
  }
};

export { apiTool };