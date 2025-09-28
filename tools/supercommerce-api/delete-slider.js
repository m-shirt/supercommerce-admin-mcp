/**
 * Function to delete slider.
 *
 * @param {Object} params - The parameters for delete slider.
 * @param {string} params.slider_id - The slider-id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      slider_id,
    } = params;

    let url = `${baseURL}/api/admin/ads/${slider-id}`;
    

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
    console.error('Error in deleteSlider:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for delete slider.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_slider',
      description: 'Delete Slider',
      parameters: {
        type: 'object',
        properties: {
          slider_id: {
            type: 'string',
            description: 'The slider-id'
          }
        },
        required: ['slider_id']
      }
    }
  }
};

export { apiTool };