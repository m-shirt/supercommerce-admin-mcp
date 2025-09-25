/**
 * Function to activate a section.
 *
 * @param {Object} params - The parameters for activating a section.
 * @param {string} params.section_id - The ID of the section to activate.
 * @returns {Promise<Object>} - The result of the section activation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { section_id } = params;

    const url = `${baseURL}/api/admin/sections/${section_id}/activate`;

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
    console.error('Error activating section:', error);
    return { error: error.message || 'An error occurred while activating the section.' };
  }
};

/**
 * Tool configuration for activating a section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_section',
      description: 'Activate a store front section by its ID.',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The ID of the section to activate.'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };