/**
 * Function to export transactions to a file.
 *
 * @param {Object} params - The parameters for exporting transactions.
 * @param {string} [params.q] - Search query to filter transactions for export.
 * @param {string} [params.status] - Filter transactions by status for export.
 * @param {string} [params.payment_method] - Filter by payment method for export.
 * @param {string} [params.date_from] - Start date for filtering (YYYY-MM-DD).
 * @param {string} [params.date_to] - End date for filtering (YYYY-MM-DD).
 * @param {string} [params.type] - Export type (default: "9" for transactions).
 * @returns {Promise<Object>} - The result of the transactions export.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q = '',
      status,
      payment_method,
      date_from,
      date_to,
      type = '9'
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
    if (payment_method) requestData.payment_method = payment_method;
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
    console.error('Error exporting transactions:', error);
    return { error: error.message || 'An error occurred while exporting transactions.' };
  }
};

/**
 * Tool configuration for exporting transactions.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_transactions',
      description: 'Export transactions to a file with optional filtering.',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Search query to filter transactions for export.'
          },
          status: {
            type: 'string',
            description: 'Filter transactions by status for export.'
          },
          payment_method: {
            type: 'string',
            description: 'Filter transactions by payment method for export.'
          },
          date_from: {
            type: 'string',
            description: 'Start date for filtering transactions (YYYY-MM-DD format).'
          },
          date_to: {
            type: 'string',
            description: 'End date for filtering transactions (YYYY-MM-DD format).'
          },
          type: {
            type: 'string',
            description: 'Export type identifier (default: "9" for transactions).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };