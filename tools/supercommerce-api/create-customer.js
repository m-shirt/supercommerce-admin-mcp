/**
 * Function to create customer.
 *
 * @param {Object} params - The parameters for create customer.


 * @param {string} [params.name] - The name.
 * @param {string} [params.last_name] - The last name.
 * @param {string} [params.email] - The email.
 * @param {string} [params.group_id] - The group id.
 * @param {string} [params.phone] - The phone.
 * @param {string} [params.password] - The password.
 * @param {string} [params.closed_payment_methods] - The closed payment methods.
 * @param {string} [params.postponed_payment_limit] - The postponed payment limit.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      last_name,
      email,
      group_id,
      phone,
      password,
      closed_payment_methods,
      postponed_payment_limit,
    } = params;

    const url = `${baseURL}/api/admin/customers`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'last_name': last_name,
      'email': email,
      'group_id': group_id,
      'phone': phone,
      'password': password,
      'closed_payment_methods': closed_payment_methods,
      'postponed_payment_limit': postponed_payment_limit,
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
    console.error('Error in createCustomer:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create customer.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_customer',
      description: 'Create Customer',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          last_name: {
            type: 'string',
            description: 'The last name'
          },
          email: {
            type: 'string',
            description: 'The email'
          },
          group_id: {
            type: 'string',
            description: 'The group id'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          },
          password: {
            type: 'string',
            description: 'The password'
          },
          closed_payment_methods: {
            type: 'string',
            description: 'The closed payment methods'
          },
          postponed_payment_limit: {
            type: 'string',
            description: 'The postponed payment limit'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };