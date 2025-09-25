/**
 * Function to export branches.
 *
 * @param {Object} params - The parameters for export branches.


 * @param {string} [params.q] - The q.
 * @param {string} [params.type] - The type.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q,
      type,
    } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'q': q,
      'type': type,
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
    console.error('Error in exportBranches:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for export branches.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_branches',
      description: 'Export Branches',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'The q'
          },
          type: {
            type: 'string',
            description: 'The type'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };