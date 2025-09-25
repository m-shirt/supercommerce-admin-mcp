/**
 * Function to save edit update delivery manager.
 *
 * @param {Object} params - The parameters for save edit update delivery manager.


 * @param {string} [params.name] - The name.
 * @param {string} [params.email] - The email.
 * @param {string} [params.password] - The password.
 * @param {string} [params.address] - The address.
 * @param {string} [params.phone] - The phone.
 * @param {string} [params.city_id] - The city id.
 * @param {string} [params.area_ids] - The area ids.
 * @param {string} [params.branch_ids] - The branch ids.
 * @param {string} [params.districts_id] - The districts id.
 * @param {string} [params.origin_city_id] - The origin city id.
 * @param {string} [params.origin_area_id] - The origin area id.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      email,
      password,
      address,
      phone,
      city_id,
      area_ids,
      branch_ids,
      districts_id,
      origin_city_id,
      origin_area_id,
    } = params;

    const url = `${baseURL}/api/admin/deliverers/1178683`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'email': email,
      'password': password,
      'address': address,
      'phone': phone,
      'city_id': city_id,
      'area_ids': area_ids,
      'branch_ids': branch_ids,
      'districts_id': districts_id,
      'origin_city_id': origin_city_id,
      'origin_area_id': origin_area_id,
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
    console.error('Error in saveEditUpdateDeliveryManager:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for save edit update delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'save_edit_update_delivery_manager',
      description: 'Save Edit update Delivery Manager',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          email: {
            type: 'string',
            description: 'The email'
          },
          password: {
            type: 'string',
            description: 'The password'
          },
          address: {
            type: 'string',
            description: 'The address'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          },
          city_id: {
            type: 'string',
            description: 'The city id'
          },
          area_ids: {
            type: 'string',
            description: 'The area ids'
          },
          branch_ids: {
            type: 'string',
            description: 'The branch ids'
          },
          districts_id: {
            type: 'string',
            description: 'The districts id'
          },
          origin_city_id: {
            type: 'string',
            description: 'The origin city id'
          },
          origin_area_id: {
            type: 'string',
            description: 'The origin area id'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };