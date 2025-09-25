/**
 * Function to delete a governorate.
 *
 * @param {Object} params - The parameters for deleting a governorate.
 * @param {string} params.city_id - The ID of the governorate to delete.
 * @returns {Promise<Object>} - The result of the governorate deletion.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { city_id } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}`;

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
    console.error('Error deleting governorate:', error);
    return { error: error.message || 'An error occurred while deleting the governorate.' };
  }
};

/**
 * Tool configuration for deleting a governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_governorate',
      description: 'Delete a governorate permanently from the system.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate to delete.'
          }
        },
        required: ['city_id']
      }
    }
  }
};

export { apiTool };