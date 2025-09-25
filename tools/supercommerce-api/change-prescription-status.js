/**
 * Function to change the status of a prescription.
 *
 * @param {Object} params - The parameters for changing prescription status.
 * @param {string} params.prescription_id - The ID of the prescription to update.
 * @param {string} params.status - The new status for the prescription.
 * @param {string} [params.notes] - Optional notes for the status change.
 * @param {string} [params.cancellation_reason_id] - ID of cancellation reason if cancelling.
 * @returns {Promise<Object>} - The result of the prescription status change.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      prescription_id,
      status,
      notes,
      cancellation_reason_id
    } = params;

    const url = `${baseURL}/api/admin/prescriptions/${prescription_id}/change_status`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      status,
      ...(notes && { notes }),
      ...(cancellation_reason_id && { cancellation_reason_id })
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error changing prescription status:', error);
    return { error: error.message || 'An error occurred while changing prescription status.' };
  }
};

/**
 * Tool configuration for changing prescription status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'change_prescription_status',
      description: 'Change the status of a prescription (approve, reject, cancel, etc.).',
      parameters: {
        type: 'object',
        properties: {
          prescription_id: {
            type: 'string',
            description: 'The ID of the prescription to update.'
          },
          status: {
            type: 'string',
            description: 'The new status for the prescription (e.g., "approved", "rejected", "cancelled").'
          },
          notes: {
            type: 'string',
            description: 'Optional notes explaining the status change.'
          },
          cancellation_reason_id: {
            type: 'string',
            description: 'ID of cancellation reason if changing status to cancelled.'
          }
        },
        required: ['prescription_id', 'status']
      }
    }
  }
};

export { apiTool };