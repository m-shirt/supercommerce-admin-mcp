/**
 * Function to create new branches.
 *
 * @param {Object} params - The parameters for create new branches.


 * @param {string} [params.shop_name] - The shop name.
 * @param {string} [params.shop_name_ar] - The shop name ar.
 * @param {string} [params.available_pickup] - The available pickup.
 * @param {string} [params.address] - The address.
 * @param {string} [params.address_ar] - The address ar.
 * @param {string} [params.area] - The area.
 * @param {string} [params.code] - The code.
 * @param {string} [params.area_ar] - The area ar.
 * @param {string} [params.lat] - The lat.
 * @param {string} [params.lng] - The lng.
 * @param {string} [params.direction_link] - The direction link.
 * @param {string} [params.order] - The order.
 * @param {string} [params.type] - The type.
 * @param {string} [params.phone] - The phone.
 * @param {string} [params.email] - The email.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      shop_name,
      shop_name_ar,
      available_pickup,
      address,
      address_ar,
      area,
      code,
      area_ar,
      lat,
      lng,
      direction_link,
      order,
      type,
      phone,
      email,
    } = params;

    const url = `${baseURL}/api/admin/branches`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'shop_name': shop_name,
      'shop_name_ar': shop_name_ar,
      'available_pickup': available_pickup,
      'address': address,
      'address_ar': address_ar,
      'area': area,
      'code': code,
      'area_ar': area_ar,
      'lat': lat,
      'lng': lng,
      'direction_link': direction_link,
      'order': order,
      'type': type,
      'phone': phone,
      'email': email,
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
    console.error('Error in createNewBranches:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create new branches.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_new_branches',
      description: 'Create New Branches',
      parameters: {
        type: 'object',
        properties: {
          shop_name: {
            type: 'string',
            description: 'The shop name'
          },
          shop_name_ar: {
            type: 'string',
            description: 'The shop name ar'
          },
          available_pickup: {
            type: 'string',
            description: 'The available pickup'
          },
          address: {
            type: 'string',
            description: 'The address'
          },
          address_ar: {
            type: 'string',
            description: 'The address ar'
          },
          area: {
            type: 'string',
            description: 'The area'
          },
          code: {
            type: 'string',
            description: 'The code'
          },
          area_ar: {
            type: 'string',
            description: 'The area ar'
          },
          lat: {
            type: 'string',
            description: 'The lat'
          },
          lng: {
            type: 'string',
            description: 'The lng'
          },
          direction_link: {
            type: 'string',
            description: 'The direction link'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          },
          email: {
            type: 'string',
            description: 'The email'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };