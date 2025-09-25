/**
 * Function to edit order status.
 *
 * @param {Object} params - The parameters for edit order status.


 * @param {string} [params.status_notes] - The status notes.
 * @param {string} [params.cancellation_text] - The cancellation text.
 * @param {string} [params.cancellation_id] - The cancellation id.
 * @param {string} [params.order_ids] - The order ids.
 * @param {string} [params.state_id] - The state id.
 * @param {string} [params.notify_customer] - The notify customer.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      status_notes,
      cancellation_text,
      cancellation_id,
      order_ids,
      state_id,
      notify_customer,
    } = params;

    const url = `${baseURL}/api/admin/orders/bulk_change_state`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'status_notes': status_notes,
      'cancellation_text': cancellation_text,
      'cancellation_id': cancellation_id,
      'order_ids': order_ids,
      'state_id': state_id,
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
    console.error('Error in editOrderStatus:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit order status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_order_status',
      description: 'Edit Order Status',
      parameters: {
        type: 'object',
        properties: {
          status_notes: {
            type: 'string',
            description: 'The status notes'
          },
          cancellation_text: {
            type: 'string',
            description: 'The cancellation text'
          },
          cancellation_id: {
            type: 'string',
            description: 'The cancellation id'
          },
          order_ids: {
            type: 'string',
            description: 'The order ids'
          },
          state_id: {
            type: 'string',
            description: 'The state id'
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