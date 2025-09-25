/**
 * Function to deactivate a branch.
 *
 * @param {Object} params - The parameters for deactivating a branch.
 * @param {string} params.branch_id - The ID of the branch to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the branch deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { branch_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/branches/${branch_id}/deactivate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ deactivation_notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deactivating branch:', error);
    return { error: error.message || 'An error occurred while deactivating the branch.' };
  }
};

/**
 * Tool configuration for deactivating a branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_branch',
      description: 'Deactivate a branch with optional notes.',
      parameters: {
        type: 'object',
        properties: {
          branch_id: {
            type: 'string',
            description: 'The ID of the branch to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['branch_id']
      }
    }
  }
};

export { apiTool };