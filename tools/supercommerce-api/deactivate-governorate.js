/**
 * Function to deactivate a governorate.
 *
 * @param {Object} params - The parameters for deactivating a governorate.
 * @param {string} params.city_id - The ID of the governorate to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the governorate deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { city_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}/deactivate`;

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
    console.error('Error deactivating governorate:', error);
    return { error: error.message || 'An error occurred while deactivating the governorate.' };
  }
};

/**
 * Tool configuration for deactivating a governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_governorate',
      description: 'Deactivate a governorate to suspend delivery services in that area.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['city_id']
      }
    }
  }
};

export { apiTool };