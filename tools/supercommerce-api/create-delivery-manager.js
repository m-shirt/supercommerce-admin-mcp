/**
 * Function to create a new delivery manager.
 *
 * @param {Object} params - The parameters for creating a delivery manager.
 * @param {string} params.name - The name of the delivery manager.
 * @param {string} params.email - The email address of the delivery manager.
 * @param {string} params.phone - The phone number of the delivery manager.
 * @param {string} params.password - The password for the delivery manager account.
 * @param {string} [params.city_id] - The city ID where the delivery manager operates.
 * @param {string} [params.address] - The address of the delivery manager.
 * @param {string} [params.vehicle_type] - Type of vehicle used for delivery.
 * @param {string} [params.vehicle_number] - Vehicle registration number.
 * @param {string} [params.license_number] - Driving license number.
 * @param {boolean} [params.is_active] - Whether the delivery manager should be active (default: true).
 * @returns {Promise<Object>} - The result of the delivery manager creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      email,
      phone,
      password,
      city_id,
      address,
      vehicle_type,
      vehicle_number,
      license_number,
      is_active = true
    } = params;

    const url = `${baseURL}/api/admin/deliverers`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name,
      email,
      phone,
      password,
      is_active,
      ...(city_id && { city_id }),
      ...(address && { address }),
      ...(vehicle_type && { vehicle_type }),
      ...(vehicle_number && { vehicle_number }),
      ...(license_number && { license_number })
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
    console.error('Error creating delivery manager:', error);
    return { error: error.message || 'An error occurred while creating the delivery manager.' };
  }
};

/**
 * Tool configuration for creating a delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_delivery_manager',
      description: 'Create a new delivery manager with personal and vehicle information.',
      parameters: {
        type: 'object',
        properties: {
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
            description: 'Type of vehicle used for delivery (e.g., "motorcycle", "car", "bicycle").'
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
            description: 'Whether the delivery manager should be active (default: true).'
          }
        },
        required: ['name', 'email', 'phone', 'password']
      }
    }
  }
};

export { apiTool };