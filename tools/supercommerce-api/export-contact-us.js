/**
 * Function to export contact us messages to a file.
 *
 * @param {Object} params - The parameters for exporting contact us messages.
 * @param {string} [params.q] - Search query to filter messages for export.
 * @param {string} [params.status] - Filter by status for export.
 * @param {string} [params.date_from] - Start date for filtering (YYYY-MM-DD).
 * @param {string} [params.date_to] - End date for filtering (YYYY-MM-DD).
 * @param {string} [params.type] - Export type (default: "12" for contact us).
 * @returns {Promise<Object>} - The result of the contact us export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q = '',
      status,
      date_from,
      date_to,
      type = '12'
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
    if (date_from) requestData.date_from = date_from;
    if (date_to) requestData.date_to = date_to;

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
    console.error('Error exporting contact us messages:', error);
    return { error: error.message || 'An error occurred while exporting contact us messages.' };
  }
};

/**
 * Tool configuration for exporting contact us messages.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_contact_us',
      description: 'Export contact us messages and customer inquiries to a file.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query to filter messages for export.'
          },
          status: {
            type: 'string',
            description: 'Filter messages by status for export.'
          },
          date_from: {
            type: 'string',
            description: 'Start date for filtering messages (YYYY-MM-DD format).'
          },
          date_to: {
            type: 'string',
            description: 'End date for filtering messages (YYYY-MM-DD format).'
          },
          type: {
            type: 'string',
            description: 'Export type identifier (default: "12" for contact us).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };