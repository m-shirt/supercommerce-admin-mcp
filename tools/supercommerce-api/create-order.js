/**
 * Function to create order.
 *
 * @param {Object} params - The parameters for create order.


 * @param {string} [params.user_id] - The user id.
 * @param {string} [params.address_id] - The address id.
 * @param {string} [params.branch_id] - The branch id.
 * @param {string} [params.payment_method] - The payment method.
 * @param {string} [params.items] - The items.
 * @param {string} [params.notes] - The notes.
 * @param {string} [params.admin_notes] - The admin notes.
 * @param {string} [params.overwrite_fees] - The overwrite fees.
 * @param {string} [params.delivery_fees] - The delivery fees.
 * @param {string} [params.has_address] - The has address.
 * @param {string} [params.has_customer] - The has customer.
 * @param {string} [params.notify_customer] - The notify customer.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      user_id,
      address_id,
      branch_id,
      payment_method,
      items,
      notes,
      admin_notes,
      overwrite_fees,
      delivery_fees,
      has_address,
      has_customer,
      notify_customer,
    } = params;

    const url = `${baseURL}/api/admin/orders`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'user_id': user_id,
      'address_id': address_id,
      'branch_id': branch_id,
      'payment_method': payment_method,
      'items': items,
      'notes': notes,
      'admin_notes': admin_notes,
      'overwrite_fees': overwrite_fees,
      'delivery_fees': delivery_fees,
      'has_address': has_address,
      'has_customer': has_customer,
      'notify_customer': notify_customer,
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
    console.error('Error in createOrder:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create order.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_order',
      description: 'Create Order',
      parameters: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            description: 'The user id'
          },
          address_id: {
            type: 'string',
            description: 'The address id'
          },
          branch_id: {
            type: 'string',
            description: 'The branch id'
          },
          payment_method: {
            type: 'string',
            description: 'The payment method'
          },
          items: {
            type: 'string',
            description: 'The items'
          },
          notes: {
            type: 'string',
            description: 'The notes'
          },
          admin_notes: {
            type: 'string',
            description: 'The admin notes'
          },
          overwrite_fees: {
            type: 'string',
            description: 'The overwrite fees'
          },
          delivery_fees: {
            type: 'string',
            description: 'The delivery fees'
          },
          has_address: {
            type: 'string',
            description: 'The has address'
          },
          has_customer: {
            type: 'string',
            description: 'The has customer'
          },
          notify_customer: {
            type: 'string',
            description: 'The notify customer'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };