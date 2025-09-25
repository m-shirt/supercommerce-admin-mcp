/**
 * Function to send a push notification.
 *
 * @param {Object} params - The parameters for sending a push notification.
 * @param {string} params.title - The title of the push notification.
 * @param {string} params.body - The body/message content of the notification.
 * @param {Array<number>} [params.customers] - Array of customer IDs to send notification to.
 * @param {number} [params.type] - Type of notification (1: general, 2: product, 3: order, etc.).
 * @param {number} [params.product_id] - Product ID if notification is product-related.
 * @param {number} [params.item_id] - Item ID if notification is item-related.
 * @param {string} [params.schedule_date] - Schedule date/time for the notification (YYYY-MM-DD HH:mm format).
 * @param {number} [params.topic_id] - Topic ID for targeted notifications.
 * @returns {Promise<Object>} - The result of sending the push notification.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      title,
      body,
      customers,
      type = 1,
      product_id,
      item_id,
      schedule_date,
      topic_id
    } = params;

    const url = `${baseURL}/api/admin/push_messages`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      title,
      body,
      type,
      ...(customers && { customers }),
      ...(product_id && { product_id }),
      ...(item_id && { item_id }),
      ...(schedule_date && { schedule_date }),
      ...(topic_id && { topic_id })
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
    console.error('Error sending push notification:', error);
    return { error: error.message || 'An error occurred while sending push notification.' };
  }
};

/**
 * Tool configuration for sending push notifications.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'send_notification',
      description: 'Send a push notification to customers with scheduling options.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the push notification.'
          },
          body: {
            type: 'string',
            description: 'The body/message content of the notification.'
          },
          customers: {
            type: 'array',
            items: {
              type: 'number'
            },
            description: 'Array of customer IDs to send notification to. If not specified, sends to all customers.'
          },
          type: {
            type: 'number',
            description: 'Type of notification (1: general, 2: product, 3: order, etc.). Default: 1.'
          },
          product_id: {
            type: 'number',
            description: 'Product ID if notification is product-related.'
          },
          item_id: {
            type: 'number',
            description: 'Item ID if notification is item-related.'
          },
          schedule_date: {
            type: 'string',
            description: 'Schedule date/time for the notification (YYYY-MM-DD HH:mm format).'
          },
          topic_id: {
            type: 'number',
            description: 'Topic ID for targeted notifications.'
          }
        },
        required: ['title', 'body']
      }
    }
  }
};

export { apiTool };