/**
 * Function to deactivate a delivery manager.
 *
 * @param {Object} params - The parameters for deactivating a delivery manager.
 * @param {string} params.deliverer_id - The ID of the delivery manager to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the delivery manager deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { deliverer_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/deliverers/${deliverer_id}/deactivate`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ deactivation_notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error deactivating delivery manager:', error);
    return { error: error.message || 'An error occurred while deactivating the delivery manager.' };
  }
};

/**
 * Tool configuration for deactivating a delivery manager.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_delivery_manager',
      description: 'Deactivate a delivery manager to prevent them from receiving new delivery assignments.',
      parameters: {
        type: 'object',
        properties: {
          deliverer_id: {
            type: 'string',
            description: 'The ID of the delivery manager to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['deliverer_id']
      }
    }
  }
};

export { apiTool };