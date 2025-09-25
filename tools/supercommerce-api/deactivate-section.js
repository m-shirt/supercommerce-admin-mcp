/**
 * Function to deactivate a section.
 *
 * @param {Object} params - The parameters for deactivating a section.
 * @param {string} params.section_id - The ID of the section to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the section deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { section_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/sections/${section_id}/deactivate`;

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
    console.error('Error deactivating section:', error);
    return { error: error.message || 'An error occurred while deactivating the section.' };
  }
};

/**
 * Tool configuration for deactivating a section.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_section',
      description: 'Deactivate a store front section with optional notes.',
      parameters: {
        type: 'object',
        properties: {
          section_id: {
            type: 'string',
            description: 'The ID of the section to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['section_id']
      }
    }
  }
};

export { apiTool };