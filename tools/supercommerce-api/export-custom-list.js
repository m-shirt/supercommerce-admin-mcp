/**
 * Function to export custom list.
 *
 * @param {Object} params - The parameters for export custom list.


 * @param {string} [params.type] - The type.
 * @param {string} [params.list_id] - The list id.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      type,
      list_id,
    } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'type': type,
      'list_id': list_id,
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
    console.error('Error in exportCustomList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for export custom list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_custom_list',
      description: 'Export Custom List',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'The type'
          },
          list_id: {
            type: 'string',
            description: 'The list id'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };