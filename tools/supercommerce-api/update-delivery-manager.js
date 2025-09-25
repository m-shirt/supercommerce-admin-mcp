/**
 * Function to update an existing delivery manager.
 *
 * @param {Object} params - The parameters for updating a delivery manager.
 * @param {string} params.deliverer_id - The ID of the delivery manager to update.
 * @param {string} [params.name] - The name of the delivery manager.
 * @param {string} [params.email] - The email address of the delivery manager.
 * @param {string} [params.phone] - The phone number of the delivery manager.
 * @param {string} [params.password] - The password for the delivery manager account.
 * @param {string} [params.city_id] - The city ID where the delivery manager operates.
 * @param {string} [params.address] - The address of the delivery manager.
 * @param {string} [params.vehicle_type] - Type of vehicle used for delivery.
 * @param {string} [params.vehicle_number] - Vehicle registration number.
 * @param {string} [params.license_number] - Driving license number.
 * @param {boolean} [params.is_active] - Whether the delivery manager is active.
 * @returns {Promise<Object>} - The result of the delivery manager update.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      deliverer_id,
      name,
      email,
      phone,
      password,
      city_id,
      address,
      vehicle_type,
      vehicle_number,
      license_number,
      is_active
    } = params;

    const url = `${baseURL}/api/admin/deliverers/${deliverer_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {};

    if (name !== undefined) requestData.name = name;
    if (email !== undefined) requestData.email = email;
    if (phone !== undefined) requestData.phone = phone;
    if (password !== undefined) requestData.password = password;
    if (city_id !== undefined) requestData.city_id = city_id;
    if (address !== undefined) requestData.address = address;
    if (vehicle_type !== undefined) requestData.vehicle_type = vehicle_type;
    if (vehicle_number !== undefined) requestData.vehicle_number = vehicle_number;
    if (license_number !== undefined) requestData.license_number = license_number;
    if (is_active !== undefined) requestData.is_active = is_active;

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
    console.error('Error updating delivery manager:', error);
    return { error: error.message || 'An error occurred while updating the delivery manager.' };
  }
};

/**
 * Tool configuration for updating a delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_delivery_manager',
      description: 'Update an existing delivery manager with new information.',
      parameters: {
        type: 'object',
        properties: {
          deliverer_id: {
            type: 'string',
            description: 'The ID of the delivery manager to update.'
          },
          name: {
            type: 'string',
            description: 'The name of the delivery manager.'
          },
          email: {
            type: 'string',
            description: 'The email address of the delivery manager.'
          },
          phone: {
            type: 'string',
            description: 'The phone number of the delivery manager.'
          },
          password: {
            type: 'string',
            description: 'The password for the delivery manager account.'
          },
          city_id: {
            type: 'string',
            description: 'The city ID where the delivery manager operates.'
          },
          address: {
            type: 'string',
            description: 'The address of the delivery manager.'
          },
          vehicle_type: {
            type: 'string',
            description: 'Type of vehicle used for delivery.'
          },
          vehicle_number: {
            type: 'string',
            description: 'Vehicle registration number.'
          },
          license_number: {
            type: 'string',
            description: 'Driving license number.'
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the delivery manager should be active.'
          }
        },
        required: ['deliverer_id']
      }
    }
  }
};

export { apiTool };