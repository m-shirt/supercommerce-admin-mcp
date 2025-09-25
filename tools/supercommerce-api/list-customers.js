/**
 * Function to list customers.
 *
 * @param {Object} params - The parameters for list customers.


 * @param {string} [params.ids] - The ids.
 * @param {string} [params.name] - The name.
 * @param {string} [params.email] - The email.
 * @param {string} [params.phone] - The phone.
 * @param {string} [params.customer_type] - The customer type.
 * @param {string} [params.area_id] - The area id.
 * @param {string} [params.city_id] - The city id.
 * @param {string} [params.active] - The active.
 * @param {string} [params.page] - The page.
 * @param {string} [params.admin_approved] - The admin approved.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      ids,
      name,
      email,
      phone,
      customer_type,
      area_id,
      city_id,
      active,
      page,
      admin_approved,
    } = params;

    const url = `${baseURL}/api/admin/v2/customers/search`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'ids': ids,
      'name': name,
      'email': email,
      'phone': phone,
      'customer_type': customer_type,
      'area_id': area_id,
      'city_id': city_id,
      'active': active,
      'page': page,
      'admin_approved': admin_approved,
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
    console.error('Error in listCustomers:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for list customers.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_customers',
      description: 'List Customers',
      parameters: {
        type: 'object',
        properties: {
          ids: {
            type: 'string',
            description: 'The ids'
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
          },
          customer_type: {
            type: 'string',
            description: 'The customer type'
          },
          area_id: {
            type: 'string',
            description: 'The area id'
          },
          city_id: {
            type: 'string',
            description: 'The city id'
          },
          active: {
            type: 'string',
            description: 'The active'
          },
          page: {
            type: 'string',
            description: 'The page'
          },
          admin_approved: {
            type: 'string',
            description: 'The admin approved'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };