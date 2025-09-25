/**
 * Function to create a new governorate (city).
 *
 * @param {Object} params - The parameters for creating a governorate.
 * @param {string} params.name - The name of the governorate.
 * @param {string} params.name_ar - The Arabic name of the governorate.
 * @param {string} [params.code] - The code/abbreviation for the governorate.
 * @param {number} [params.delivery_fees] - Default delivery fees for this governorate.
 * @param {boolean} [params.is_active] - Whether the governorate should be active (default: true).
 * @returns {Promise<Object>} - The result of the governorate creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      name_ar,
      code,
      delivery_fees,
      is_active = true
    } = params;

    const url = `${baseURL}/api/admin/cities`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name,
      name_ar,
      is_active,
      ...(code && { code }),
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
    console.error('Error creating governorate:', error);
    return { error: error.message || 'An error occurred while creating the governorate.' };
  }
};

/**
 * Tool configuration for creating a governorate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_governorate',
      description: 'Create a new governorate (city) with English and Arabic names.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The English name of the governorate.'
          },
          name_ar: {
            type: 'string',
            description: 'The Arabic name of the governorate.'
          },
          code: {
            type: 'string',
            description: 'The code/abbreviation for the governorate (optional).'
          },
          delivery_fees: {
            type: 'number',
            description: 'Default delivery fees for this governorate (optional).'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the governorate should be active (default: true).'
          }
        },
        required: ['name', 'name_ar']
      }
    }
  }
};

export { apiTool };