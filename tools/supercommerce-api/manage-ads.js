/**
 * Function to manage ads (get, create, update, activate, deactivate).
 *
 * @param {Object} params - The parameters for managing ads.
 * @param {string} params.action - The action to perform: "get", "create", "update", "activate", "deactivate".
 * @param {string} [params.ad_id] - The ID of the ad (required for update, activate, deactivate actions).
 * @param {string} [params.name] - Name of the ad (for create/update).
 * @param {string} [params.description] - Description of the ad (for create/update).
 * @param {string} [params.image_url] - Image URL for the ad (for create/update).
 * @param {string} [params.link_url] - Link URL for the ad (for create/update).
 * @param {boolean} [params.active] - Whether the ad is active (for create/update).
 * @param {number} [params.order] - Display order of the ad (for create/update).
 * @param {string} [params.start_date] - Start date for the ad (for create/update).
 * @param {string} [params.end_date] - End date for the ad (for create/update).
 * @param {string} [params.deactivation_notes] - Notes for deactivation (for deactivate action).
 * @returns {Promise<Object>} - The result of the ad management operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { action, ad_id, deactivation_notes, ...adData } = params;

    let url, method, body;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'get':
        url = ad_id ? `${baseURL}/api/admin/ads/${ad_id}` : `${baseURL}/api/admin/ads`;
        method = 'GET';
        break;

      case 'create':
        url = `${baseURL}/api/admin/ads`;
        method = 'POST';
        body = JSON.stringify(adData);
        break;

      case 'update':
        if (!ad_id) throw new Error('ad_id is required for update action');
        url = `${baseURL}/api/admin/ads/${ad_id}`;
        method = 'PUT';
        body = JSON.stringify(adData);
        break;

      case 'activate':
        if (!ad_id) throw new Error('ad_id is required for activate action');
        url = `${baseURL}/api/admin/ads/${ad_id}/activate`;
        method = 'POST';
        body = JSON.stringify({});
        break;

      case 'deactivate':
        if (!ad_id) throw new Error('ad_id is required for deactivate action');
        url = `${baseURL}/api/admin/ads/${ad_id}/deactivate`;
        method = 'POST';
        body = JSON.stringify({ deactivation_notes: deactivation_notes || '' });
        break;

      default:
        throw new Error(`Invalid action: ${action}. Valid actions are: get, create, update, activate, deactivate`);
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error managing ads:', error);
    return { error: error.message || 'An error occurred while managing ads.' };
  }
};

/**
 * Tool configuration for managing ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'manage_ads',
      description: 'Comprehensive ad management tool for getting, creating, updating, activating, and deactivating ads.',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['get', 'create', 'update', 'activate', 'deactivate'],
            description: 'The action to perform on ads.'
          },
          ad_id: {
            type: 'string',
            description: 'The ID of the ad (required for update, activate, deactivate actions).'
          },
          name: {
            type: 'string',
            description: 'Name of the ad (for create/update).'
          },
          description: {
            type: 'string',
            description: 'Description of the ad (for create/update).'
          },
          image_url: {
            type: 'string',
            description: 'Image URL for the ad (for create/update).'
          },
          link_url: {
            type: 'string',
            description: 'Link URL for the ad (for create/update).'
          },
          active: {
            type: 'boolean',
            description: 'Whether the ad is active (for create/update).'
          },
          order: {
            type: 'integer',
            description: 'Display order of the ad (for create/update).',
            minimum: 1
          },
          start_date: {
            type: 'string',
            description: 'Start date for the ad (format: YYYY-MM-DD) (for create/update).'
          },
          end_date: {
            type: 'string',
            description: 'End date for the ad (format: YYYY-MM-DD) (for create/update).'
          },
          deactivation_notes: {
            type: 'string',
            description: 'Notes for deactivation (for deactivate action).'
          }
        },
        required: ['action']
      }
    }
  }
};

export { apiTool };