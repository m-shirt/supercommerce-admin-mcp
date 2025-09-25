/**
 * Function to deactivate branch.
 *
 * @param {Object} params - The parameters for deactivate branch.
 * @param {string} params.id - The id.

 * @param {string} [params.deactivation_notes] - The deactivation notes.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      id,
      deactivation_notes,
    } = params;

    let url = `${baseURL}/api/admin/branches/${id}/deactivate`;
    

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
    console.error('Error in deactivateBranch:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_branch',
      description: 'Deactivate Branch',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id'
          },
          deactivation_notes: {
            type: 'string',
            description: 'The deactivation notes'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };