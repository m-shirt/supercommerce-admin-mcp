/**
 * Function to export delivery managers data to a file.
 *
 * @param {Object} params - The parameters for exporting delivery managers.
 * @param {string} [params.q] - Search query to filter delivery managers for export.
 * @param {string} [params.status] - Filter by status for export.
 * @param {string} [params.city_id] - Filter by city ID for export.
 * @param {string} [params.type] - Export type (default: "10" for delivery managers).
 * @returns {Promise<Object>} - The result of the delivery managers export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q = '',
      status,
      city_id,
      type = '10'
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
    if (city_id) requestData.city_id = city_id;

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
    console.error('Error exporting delivery managers:', error);
    return { error: error.message || 'An error occurred while exporting delivery managers.' };
  }
};

/**
 * Tool configuration for exporting delivery managers.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_delivery_managers',
      description: 'Export delivery managers data to a file with optional filtering.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query to filter delivery managers for export.'
          },
          status: {
            type: 'string',
            description: 'Filter delivery managers by status for export.'
          },
          city_id: {
            type: 'string',
            description: 'Filter delivery managers by city ID for export.'
          },
          type: {
            type: 'string',
            description: 'Export type identifier (default: "10" for delivery managers).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };