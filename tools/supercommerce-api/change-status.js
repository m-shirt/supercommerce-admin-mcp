/**
 * Function to change status.
 *
 * @param {Object} params - The parameters for change status.


 * @param {string} [params.invoice_id] - The invoice id.
 * @param {string} [params.amount] - The amount.
 * @param {string} [params.comment] - The comment.
 * @param {string} [params.cancel_reason] - The cancel reason.
 * @param {string} [params.cancellation_id] - The cancellation id.
 * @param {string} [params.status] - The status.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      invoice_id,
      amount,
      comment,
      cancel_reason,
      cancellation_id,
      status,
    } = params;

    const url = `${baseURL}/api/admin/prescriptions/1/change_status`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'invoice_id': invoice_id,
      'amount': amount,
      'comment': comment,
      'cancel_reason': cancel_reason,
      'cancellation_id': cancellation_id,
      'status': status,
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
    console.error('Error in changeStatus:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for change status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'change_status',
      description: 'Change Status',
      parameters: {
        type: 'object',
        properties: {
          invoice_id: {
            type: 'string',
            description: 'The invoice id'
          },
          amount: {
            type: 'string',
            description: 'The amount'
          },
          comment: {
            type: 'string',
            description: 'The comment'
          },
          cancel_reason: {
            type: 'string',
            description: 'The cancel reason'
          },
          cancellation_id: {
            type: 'string',
            description: 'The cancellation id'
          },
          status: {
            type: 'string',
            description: 'The status'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };