/**
 * Function to export groups to a CSV file.
 *
 * @param {Object} params - The parameters for exporting groups.
 * @param {string} [params.q] - Search query to filter groups for export.
 * @param {string} [params.type] - Export type (default: "5" for groups).
 * @returns {Promise<Object>} - The result of the groups export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { q = '', type = '5' } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      q,
      type: parseInt(type)
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
    console.error('Error exporting groups:', error);
    return { error: error.message || 'An error occurred while exporting groups.' };
  }
};

/**
 * Tool configuration for exporting groups.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_groups',
      description: 'Export groups to a CSV file with optional search filtering.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query to filter groups for export.'
          },
          type: {
            type: 'string',
            description: 'Export type identifier (default: "5" for groups).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };