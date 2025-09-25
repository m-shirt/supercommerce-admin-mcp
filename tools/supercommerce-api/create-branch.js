/**
 * Function to create a new branch.
 *
 * @param {Object} params - The parameters for creating a branch.
 * @param {string} params.name - Name of the branch.
 * @param {string} params.address - Address of the branch.
 * @param {string} [params.phone] - Phone number of the branch.
 * @param {string} [params.email] - Email address of the branch.
 * @param {string} [params.city] - City where the branch is located.
 * @param {string} [params.area] - Area/district of the branch.
 * @param {string} [params.manager_name] - Name of the branch manager.
 * @param {string} [params.working_hours] - Working hours of the branch.
 * @param {boolean} [params.active] - Whether the branch is active (default: true).
 * @param {string} [params.type] - Type of branch.
 * @returns {Promise<Object>} - The result of the branch creation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/branches`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      name: params.name,
      address: params.address,
      phone: params.phone || '',
      email: params.email || '',
      city: params.city || '',
      area: params.area || '',
      manager_name: params.manager_name || '',
      working_hours: params.working_hours || '',
      active: params.active !== undefined ? params.active : true,
      type: params.type || ''
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
    console.error('Error creating branch:', error);
    return { error: error.message || 'An error occurred while creating the branch.' };
  }
};

/**
 * Tool configuration for creating a branch.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_branch',
      description: 'Create a new branch location with comprehensive details.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the branch.'
          },
          address: {
            type: 'string',
            description: 'Address of the branch.'
          },
          phone: {
            type: 'string',
            description: 'Phone number of the branch.'
          },
          email: {
            type: 'string',
            description: 'Email address of the branch.'
          },
          city: {
            type: 'string',
            description: 'City where the branch is located.'
          },
          area: {
            type: 'string',
            description: 'Area/district of the branch.'
          },
          manager_name: {
            type: 'string',
            description: 'Name of the branch manager.'
          },
          working_hours: {
            type: 'string',
            description: 'Working hours of the branch (e.g., "9 AM - 9 PM").'
          },
          active: {
            type: 'boolean',
            description: 'Whether the branch is active (default: true).'
          },
          type: {
            type: 'string',
            description: 'Type of branch (e.g., main, satellite).'
          }
        },
        required: ['name', 'address']
      }
    }
  }
};

export { apiTool };