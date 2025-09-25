/**
 * Function to edit an existing custom ad.
 *
 * @param {Object} params - The parameters for editing a custom ad.
 * @param {string} params.ad_id - The ID of the custom ad to edit.
 * @param {string} [params.name] - Updated name of the custom ad.
 * @param {string} [params.description] - Updated description of the custom ad.
 * @param {string} [params.image_url] - Updated image URL for the ad.
 * @param {string} [params.link_url] - Updated link URL for the ad.
 * @param {boolean} [params.active] - Whether the ad is active.
 * @param {number} [params.order] - Display order of the ad.
 * @param {string} [params.start_date] - Start date for the ad.
 * @param {string} [params.end_date] - End date for the ad.
 * @returns {Promise<Object>} - The result of the custom ad update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { ad_id, ...updateData } = params;
    const url = `${baseURL}/api/admin/custom-ads/${ad_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Only include fields that are provided
    const requestData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        requestData[key] = updateData[key];
      }
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error editing custom ad:', error);
    return { error: error.message || 'An error occurred while editing the custom ad.' };
  }
};

/**
 * Tool configuration for editing a custom ad.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_custom_ad',
      description: 'Edit an existing custom ad with updated information.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the custom ad to edit.'
          },
          name: {
            type: 'string',
            description: 'Updated name of the custom ad.'
          },
          description: {
            type: 'string',
            description: 'Updated description of the custom ad.'
          },
          image_url: {
            type: 'string',
            description: 'Updated image URL for the ad.'
          },
          link_url: {
            type: 'string',
            description: 'Updated link URL for the ad.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the ad is active.'
          },
          order: {
            type: 'integer',
            description: 'Display order of the ad.',
            minimum: 1
          },
          start_date: {
            type: 'string',
            description: 'Start date for the ad (format: YYYY-MM-DD).'
          },
          end_date: {
            type: 'string',
            description: 'End date for the ad (format: YYYY-MM-DD).'
          }
        },
        required: ['ad_id']
      }
    }
  }
};

export { apiTool };