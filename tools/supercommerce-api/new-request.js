/**
 * Function to new request.
 *
 * @param {Object} params - The parameters for new request.
 * @param {string} params.section_id - The section id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      section_id,
    } = params;

    let url = `${baseURL}/api/admin/sections/${section_id}`;
    

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
    console.error('Error in newRequest:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new request.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_request',
      description: 'New Request',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The section id'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };