/**
 * Function to activate section.
 *
 * @param {Object} params - The parameters for activate section.
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

    let url = `${baseURL}/api/admin/sections/${section_id}/activate`;
    

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
    console.error('Error in activateSection:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_section',
      description: 'Activate Section',
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