/**
 * Function to get details of a specific section.
 *
 * @param {Object} params - The parameters for getting section details.
 * @param {string} params.section_id - The ID of the section to retrieve.
 * @returns {Promise<Object>} - The result containing section details.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { section_id } = params;

    const url = `${baseURL}/api/admin/sections/${section_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting section details:', error);
    return { error: error.message || 'An error occurred while fetching section details.' };
  }
};

/**
 * Tool configuration for getting section details.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_section_details',
      description: 'Get detailed information about a specific store front section.',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The ID of the section to retrieve details for.'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };