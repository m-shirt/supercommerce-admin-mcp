/**
 * Function to create a new area within a governorate.
 *
 * @param {Object} params - The parameters for creating an area.
 * @param {string} params.city_id - The ID of the governorate to create the area in.
 * @param {string} params.name - The name of the area.
 * @param {string} params.name_ar - The Arabic name of the area.
 * @param {number} [params.delivery_fees] - Delivery fees for this area.
 * @param {boolean} [params.is_active] - Whether the area should be active (default: true).
 * @returns {Promise<Object>} - The result of the area creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      city_id,
      name,
      name_ar,
      delivery_fees,
      is_active = true
    } = params;

    const url = `${baseURL}/api/admin/cities/${city_id}/areas`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name,
      name_ar,
      is_active,
      ...(delivery_fees && { delivery_fees })
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
    console.error('Error creating area:', error);
    return { error: error.message || 'An error occurred while creating the area.' };
  }
};

/**
 * Tool configuration for creating an area.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_area',
      description: 'Create a new area within a specific governorate.',
      parameters: {
        type: 'object',
        properties: {
          city_id: {
            type: 'string',
            description: 'The ID of the governorate to create the area in.'
          },
          name: {
            type: 'string',
            description: 'The English name of the area.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the area.'
          },
          delivery_fees: {
            type: 'number',
            description: 'Delivery fees for this area (optional).'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the area should be active (default: true).'
          }
        },
        required: ['city_id', 'name', 'name_ar']
      }
    }
  }
};

export { apiTool };