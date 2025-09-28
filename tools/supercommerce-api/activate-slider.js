/**
 * Function to activate slider.
 *
 * @param {Object} params - The parameters for activate slider.
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

    let url = `${baseURL}/api/admin/ads/${slider-id}/activate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in activateSlider:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate slider.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_slider',
      description: 'Activate Slider',
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