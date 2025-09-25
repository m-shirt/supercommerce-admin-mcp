/**
 * Function to push notification.
 *
 * @param {Object} params - The parameters for push notification.


 * @param {string} [params.title] - The title.
 * @param {string} [params.body] - The body.
 * @param {string} [params.customers] - The customers.
 * @param {string} [params.type] - The type.
 * @param {string} [params.product_id] - The product id.
 * @param {string} [params.item_id] - The item id.
 * @param {string} [params.schedule_date] - The schedule date.
 * @param {string} [params.topic_id] - The topic id.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      title,
      body,
      customers,
      type,
      product_id,
      item_id,
      schedule_date,
      topic_id,
    } = params;

    const url = `${baseURL}/api/admin/push_messages`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'title': title,
      'body': body,
      'customers': customers,
      'type': type,
      'product_id': product_id,
      'item_id': item_id,
      'schedule_date': schedule_date,
      'topic_id': topic_id,
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
    console.error('Error in pushNotification:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for push notification.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'push_notification',
      description: 'Push Notification',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title'
          },
          body: {
            type: 'string',
            description: 'The body'
          },
          customers: {
            type: 'string',
            description: 'The customers'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          product_id: {
            type: 'string',
            description: 'The product id'
          },
          item_id: {
            type: 'string',
            description: 'The item id'
          },
          schedule_date: {
            type: 'string',
            description: 'The schedule date'
          },
          topic_id: {
            type: 'string',
            description: 'The topic id'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };