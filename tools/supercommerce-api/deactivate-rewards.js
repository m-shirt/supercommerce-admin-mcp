/**
 * Function to deactivate rewards.
 *
 * @param {Object} params - The parameters for deactivate rewards.
 * @param {string} params.reward_id - The reward id.

 * @param {string} [params.deactivation_notes] - The deactivation notes.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      reward_id,
      deactivation_notes,
    } = params;

    let url = `${baseURL}/api/admin/rewards/${reward_id}/deactivate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'deactivation_notes': deactivation_notes,
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
    console.error('Error in deactivateRewards:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for deactivate rewards.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_rewards',
      description: 'Deactivate Rewards',
      parameters: {
        type: 'object',
        properties: {
          reward_id: {
            type: 'string',
            description: 'The reward id'
          },
          deactivation_notes: {
            type: 'string',
            description: 'The deactivation notes'
          }
        },
        required: ['reward_id']
      }
    }
  }
};

export { apiTool };