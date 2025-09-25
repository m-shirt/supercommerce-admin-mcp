/**
 * Function to delete a push notification.
 *
 * @param {Object} params - The parameters for deleting a push notification.
 * @param {string} params.notification_id - The ID of the notification to delete.
 * @returns {Promise<Object>} - The result of deleting the push notification.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { notification_id } = params;

    const url = `${baseURL}/api/admin/push_messages/${notification_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting push notification:', error);
    return { error: error.message || 'An error occurred while deleting push notification.' };
  }
};

/**
 * Tool configuration for deleting push notifications.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_notification',
      description: 'Delete a push notification by its ID.',
      parameters: {
        type: 'object',
        properties: {
          notification_id: {
            type: 'string',
            description: 'The ID of the notification to delete.'
          }
        },
        required: ['notification_id']
      }
    }
  }
};

export { apiTool };