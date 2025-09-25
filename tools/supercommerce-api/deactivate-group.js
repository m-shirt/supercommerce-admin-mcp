/**
 * Function to deactivate a group.
 *
 * @param {Object} params - The parameters for deactivating a group.
 * @param {string} params.group_id - The ID of the group to deactivate.
 * @param {string} [params.deactivation_notes] - Optional notes for the deactivation.
 * @returns {Promise<Object>} - The result of the group deactivation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { group_id, deactivation_notes = '' } = params;

    const url = `${baseURL}/api/admin/groups/${group_id}/deactivate`;

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
    console.error('Error deactivating group:', error);
    return { error: error.message || 'An error occurred while deactivating the group.' };
  }
};

/**
 * Tool configuration for deactivating a group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_group',
      description: 'Deactivate a group by its ID with optional notes.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to deactivate.'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Optional notes explaining the reason for deactivation.'
          }
        },
        required: ['group_id']
      }
    }
  }
};

export { apiTool };