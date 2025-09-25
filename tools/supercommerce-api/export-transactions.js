/**
 * Function to export transactions.
 *
 * @param {Object} params - The parameters for export transactions.


 * @param {string} [params.q] - The q.
 * @param {string} [params.page] - The page.
 * @param {string} [params.date_from] - The date from.
 * @param {string} [params.date_to] - The date to.
 * @param {string} [params.status] - The status.
 * @param {string} [params.type] - The type.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q,
      page,
      date_from,
      date_to,
      status,
      type,
    } = params;

    const url = `${baseURL}/api/admin/v2/files/exports/export`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'q': q,
      'page': page,
      'date_from': date_from,
      'date_to': date_to,
      'status': status,
      'type': type,
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
    console.error('Error in exportTransactions:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for export transactions.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_transactions',
      description: 'Export Transactions',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'The q'
          },
          page: {
            type: 'string',
            description: 'The page'
          },
          date_from: {
            type: 'string',
            description: 'The date from'
          },
          date_to: {
            type: 'string',
            description: 'The date to'
          },
          status: {
            type: 'string',
            description: 'The status'
          },
          type: {
            type: 'string',
            description: 'The type'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };