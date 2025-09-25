/**
 * Function to new rewards.
 *
 * @param {Object} params - The parameters for new rewards.


 * @param {string} [params.id] - The id.
 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.description] - The description.
 * @param {string} [params.description_ar] - The description ar.
 * @param {string} [params.point_cost] - The point cost.
 * @param {string} [params.is_gold] - The is gold.
 * @param {string} [params.type] - The type.
 * @param {string} [params.image] - The image.
 * @param {string} [params.amount_type] - The amount type.
 * @param {string} [params.amount] - The amount.
 * @param {string} [params.max_amount] - The max amount.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      id,
      name,
      name_ar,
      description,
      description_ar,
      point_cost,
      is_gold,
      type,
      image,
      amount_type,
      amount,
      max_amount,
    } = params;

    const url = `${baseURL}/api/admin/rewards`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'id': id,
      'name': name,
      'name_ar': name_ar,
      'description': description,
      'description_ar': description_ar,
      'point_cost': point_cost,
      'is_gold': is_gold,
      'type': type,
      'image': image,
      'amount_type': amount_type,
      'amount': amount,
      'max_amount': max_amount,
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
    console.error('Error in newRewards:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for new rewards.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'new_rewards',
      description: 'New Rewards',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          description: {
            type: 'string',
            description: 'The description'
          },
          description_ar: {
            type: 'string',
            description: 'The description ar'
          },
          point_cost: {
            type: 'string',
            description: 'The point cost'
          },
          is_gold: {
            type: 'string',
            description: 'The is gold'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          image: {
            type: 'string',
            description: 'The image'
          },
          amount_type: {
            type: 'string',
            description: 'The amount type'
          },
          amount: {
            type: 'string',
            description: 'The amount'
          },
          max_amount: {
            type: 'string',
            description: 'The max amount'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };