/**
 * Function to list placed orders.
 *
 * @param {Object} params - The parameters for list placed orders.


 * @param {string} [params.term] - The term.
 * @param {string} [params.state_id] - The state id.
 * @param {string} [params.date_from] - The date from.
 * @param {string} [params.date_to] - The date to.
 * @param {string} [params.start_date_time] - The start date time.
 * @param {string} [params.end_date_time] - The end date time.
 * @param {string} [params.branch_ids] - The branch ids.
 * @param {string} [params.branch_assign] - The branch assign.
 * @param {string} [params.address_type] - The address type.
 * @param {string} [params.customer_city_ids] - The customer city ids.
 * @param {string} [params.customer_area_ids] - The customer area ids.
 * @param {string} [params.hide_scheduled] - The hide scheduled.
 * @param {string} [params.ids] - The ids.
 * @param {string} [params.vendor_id] - The vendor id.
 * @param {string} [params.campaign_id] - The campaign id.
 * @param {string} [params.customer_name] - The customer name.
 * @param {string} [params.customer_email] - The customer email.
 * @param {string} [params.customer_phone] - The customer phone.
 * @param {string} [params.shipping_id] - The shipping id.
 * @param {string} [params.delivery_man_ids] - The delivery man ids.
 * @param {string} [params.payment_method] - The payment method.
 * @param {string} [params.user_agent] - The user agent.
 * @param {string} [params.order_type] - The order type.
 * @param {string} [params.id_from] - The id from.
 * @param {string} [params.id_to] - The id to.
 * @param {string} [params.time_slot_id] - The time slot id.
 * @param {string} [params.scheduled_at] - The scheduled at.
 * @param {string} [params.per_page] - The per page.
 * @param {string} [params.state_ids] - The state ids.
 * @param {string} [params.payment_method_ids] - The payment method ids.
 * @param {string} [params.page] - The page.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      term,
      state_id,
      date_from,
      date_to,
      start_date_time,
      end_date_time,
      branch_ids,
      branch_assign,
      address_type,
      customer_city_ids,
      customer_area_ids,
      hide_scheduled,
      ids,
      vendor_id,
      campaign_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_id,
      delivery_man_ids,
      payment_method,
      user_agent,
      order_type,
      id_from,
      id_to,
      time_slot_id,
      scheduled_at,
      per_page,
      state_ids,
      payment_method_ids,
      page,
    } = params;

    const url = `${baseURL}/api/admin/v2/orders`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'term': term,
      'state_id': state_id,
      'date_from': date_from,
      'date_to': date_to,
      'start_date_time': start_date_time,
      'end_date_time': end_date_time,
      'branch_ids': branch_ids,
      'branch_assign': branch_assign,
      'address_type': address_type,
      'customer_city_ids': customer_city_ids,
      'customer_area_ids': customer_area_ids,
      'hide_scheduled': hide_scheduled,
      'ids': ids,
      'vendor_id': vendor_id,
      'campaign_id': campaign_id,
      'customer_name': customer_name,
      'customer_email': customer_email,
      'customer_phone': customer_phone,
      'shipping_id': shipping_id,
      'delivery_man_ids': delivery_man_ids,
      'payment_method': payment_method,
      'user_agent': user_agent,
      'order_type': order_type,
      'id_from': id_from,
      'id_to': id_to,
      'time_slot_id': time_slot_id,
      'scheduled_at': scheduled_at,
      'per_page': per_page,
      'state_ids': state_ids,
      'payment_method_ids': payment_method_ids,
      'page': page,
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
    console.error('Error in listPlacedOrders:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for list placed orders.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_placed_orders',
      description: 'List Placed Orders',
      parameters: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            description: 'The term'
          },
          state_id: {
            type: 'string',
            description: 'The state id'
          },
          date_from: {
            type: 'string',
            description: 'The date from'
          },
          date_to: {
            type: 'string',
            description: 'The date to'
          },
          start_date_time: {
            type: 'string',
            description: 'The start date time'
          },
          end_date_time: {
            type: 'string',
            description: 'The end date time'
          },
          branch_ids: {
            type: 'string',
            description: 'The branch ids'
          },
          branch_assign: {
            type: 'string',
            description: 'The branch assign'
          },
          address_type: {
            type: 'string',
            description: 'The address type'
          },
          customer_city_ids: {
            type: 'string',
            description: 'The customer city ids'
          },
          customer_area_ids: {
            type: 'string',
            description: 'The customer area ids'
          },
          hide_scheduled: {
            type: 'string',
            description: 'The hide scheduled'
          },
          ids: {
            type: 'string',
            description: 'The ids'
          },
          vendor_id: {
            type: 'string',
            description: 'The vendor id'
          },
          campaign_id: {
            type: 'string',
            description: 'The campaign id'
          },
          customer_name: {
            type: 'string',
            description: 'The customer name'
          },
          customer_email: {
            type: 'string',
            description: 'The customer email'
          },
          customer_phone: {
            type: 'string',
            description: 'The customer phone'
          },
          shipping_id: {
            type: 'string',
            description: 'The shipping id'
          },
          delivery_man_ids: {
            type: 'string',
            description: 'The delivery man ids'
          },
          payment_method: {
            type: 'string',
            description: 'The payment method'
          },
          user_agent: {
            type: 'string',
            description: 'The user agent'
          },
          order_type: {
            type: 'string',
            description: 'The order type'
          },
          id_from: {
            type: 'string',
            description: 'The id from'
          },
          id_to: {
            type: 'string',
            description: 'The id to'
          },
          time_slot_id: {
            type: 'string',
            description: 'The time slot id'
          },
          scheduled_at: {
            type: 'string',
            description: 'The scheduled at'
          },
          per_page: {
            type: 'string',
            description: 'The per page'
          },
          state_ids: {
            type: 'string',
            description: 'The state ids'
          },
          payment_method_ids: {
            type: 'string',
            description: 'The payment method ids'
          },
          page: {
            type: 'string',
            description: 'The page'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };