/**
 * Function to activate reward.
 *
 * @param {Object} params - The parameters for activate reward.
 * @param {string} params.reward_id - The reward id.


 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      reward_id,
    } = params;

    let url = `${baseURL}/api/admin/rewards/${reward_id}/activate`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in activateReward:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for activate reward.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_reward',
      description: 'activate Reward',
      parameters: {
        type: 'object',
        properties: {
          reward_id: {
            type: 'string',
            description: 'The reward id'
          }
        },
        required: ['reward_id']
      }
    }
  }
};

export { apiTool };