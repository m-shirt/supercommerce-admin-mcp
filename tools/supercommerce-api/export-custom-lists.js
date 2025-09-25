/**
 * Function to export custom lists to a CSV file.
 *
 * @param {Object} params - The parameters for exporting custom lists.
 * @param {string} [params.type] - Export type (default: "7" for custom lists).
 * @param {string} [params.list_id] - Specific list ID to export (optional).
 * @returns {Promise<Object>} - The result of the custom lists export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { type = '7', list_id } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      type: parseInt(type)
    };

    if (list_id) {
      requestData.list_id = parseInt(list_id);
    }

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
    console.error('Error exporting custom lists:', error);
    return { error: error.message || 'An error occurred while exporting custom lists.' };
  }
};

/**
 * Tool configuration for exporting custom lists.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_custom_lists',
      description: 'Export custom lists to a CSV file. Can export all lists or a specific list.',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Export type identifier (default: "7" for custom lists).'
          },
          list_id: {
            type: 'string',
            description: 'Specific list ID to export (optional, exports all if not provided).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };