/**
 * Function to save edit profile.
 *
 * @param {Object} params - The parameters for save edit profile.


 * @param {string} [params.image] - The image.
 * @param {string} [params.name] - The name.
 * @param {string} [params.email] - The email.
 * @param {string} [params.phone] - The phone.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      image,
      name,
      email,
      phone,
    } = params;

    const url = `${baseURL}/api/admin/profile`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'image': image,
      'name': name,
      'email': email,
      'phone': phone,
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
    console.error('Error in saveEditProfile:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for save edit profile.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_edit_profile',
      description: 'Save Edit Profile',
      parameters: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'The image'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          email: {
            type: 'string',
            description: 'The email'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };