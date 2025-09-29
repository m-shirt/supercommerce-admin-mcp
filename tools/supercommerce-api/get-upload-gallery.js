/**
 * Function to get upload  gallery.
 *
 * @param {Object} params - The parameters for get upload  gallery.

 * @param {string} [params.page] - page.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
    } = params;

    let url = `${baseURL}/api/admin/v2/uploads?page=1`;
    
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page);
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

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
    console.error('Error in getUploadGallery:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get upload  gallery.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_upload_gallery',
      description: 'Get Upload  Gallery',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'page'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };