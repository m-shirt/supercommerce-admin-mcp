/**
 * Function to export prescription.
 *
 * @param {Object} params - The parameters for export prescription.


 * @param {string} [params.q] - The q.
 * @param {string} [params.date_from] - The date from.
 * @param {string} [params.date_to] - The date to.
 * @param {string} [params.type] - The type.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      q,
      date_from,
      date_to,
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
      'date_from': date_from,
      'date_to': date_to,
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
    console.error('Error in exportPrescription:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for export prescription.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_prescription',
      description: 'Export Prescription',
      parameters: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'The q'
          },
          date_from: {
            type: 'string',
            description: 'The date from'
          },
          date_to: {
            type: 'string',
            description: 'The date to'
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