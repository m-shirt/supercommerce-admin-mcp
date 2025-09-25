/**
 * Function to deactivate an area.
 *
 * @param {Object} params - The parameters for deactivating an area.
 * @param {string} params.city_id - The ID of the governorate.
 * @param {string} params.area_id - The ID of the area to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the area deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { city_id, area_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}/areas/${area_id}/deactivate`;

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
    console.error('Error deactivating area:', error);
    return { error: error.message || 'An error occurred while deactivating the area.' };
  }
};

/**
 * Tool configuration for deactivating an area.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_area',
      description: 'Deactivate an area to suspend delivery services in that location.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate.'
          },
          area_id: {
            type: 'string',
            description: 'The ID of the area to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['city_id', 'area_id']
      }
    }
  }
};

export { apiTool };