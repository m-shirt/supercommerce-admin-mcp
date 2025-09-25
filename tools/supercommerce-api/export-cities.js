/**
 * Function to export cities/governorates data to a file.
 *
 * @param {Object} params - The parameters for exporting cities.
 * @param {string} [params.q] - Search query to filter cities for export.
 * @param {string} [params.status] - Filter by status for export.
 * @param {string} [params.type] - Export type (default: "11" for cities).
 * @returns {Promise<Object>} - The result of the cities export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q = '',
      status,
      type = '11'
    } = params;

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

    if (status) requestData.status = status;

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
    console.error('Error exporting cities:', error);
    return { error: error.message || 'An error occurred while exporting cities.' };
  }
};

/**
 * Tool configuration for exporting cities.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_cities',
      description: 'Export cities/governorates data to a file with optional filtering.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query to filter cities for export.'
          },
          status: {
            type: 'string',
            description: 'Filter cities by status for export.'
          },
          type: {
            type: 'string',
            description: 'Export type identifier (default: "11" for cities).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };