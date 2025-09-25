/**
 * Function to export contact us.
 *
 * @param {Object} params - The parameters for export contact us.


 * @param {string} [params.page] - The page.
 * @param {string} [params.q] - The q.
 * @param {string} [params.id] - The id.
 * @param {string} [params.type] - The type.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
      q,
      id,
      type,
    } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'page': page,
      'q': q,
      'id': id,
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
    console.error('Error in exportContactUs:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for export contact us.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_contact_us',
      description: 'Export Contact us',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'The page'
          },
          q: {
            type: 'string',
            description: 'The q'
          },
          id: {
            type: 'string',
            description: 'The id'
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