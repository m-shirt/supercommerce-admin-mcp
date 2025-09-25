/**
 * Function to import custom lists from a file.
 *
 * @param {Object} params - The parameters for importing custom lists.
 * @param {string} params.file_path - The path or URL to the file to import.
 * @param {string} [params.type] - The import type (default: "7" for custom lists).
 * @returns {Promise<Object>} - The result of the custom lists import.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { file_path, type = "7" } = params;

    const url = `${baseURL}/api/admin/v2/files/imports/import`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    // Create FormData for file upload
    const formData = new FormData();

    // If file_path is a URL, fetch the file first
    if (file_path.startsWith('http')) {
      const fileResponse = await fetch(file_path);
      const fileBlob = await fileResponse.blob();
      const fileName = file_path.split('/').pop() || 'custom_lists_import.csv';
      formData.append('file', fileBlob, fileName);
    } else {
      // Assume file_path is a local file path or base64 encoded data
      // Note: In a real implementation, you'd handle file reading appropriately
      throw new Error('Local file path handling not implemented. Please provide a URL to the file.');
    }

    formData.append('type', type);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error importing custom lists:', error);
    return { error: error.message || 'An error occurred while importing custom lists.' };
  }
};

/**
 * Tool configuration for importing custom lists.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'import_custom_lists',
      description: 'Import custom lists from a CSV file. File must be accessible via URL.',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'URL to the CSV file containing custom lists data to import.'
          },
          type: {
            type: 'string',
            description: 'Import type identifier (default: "7" for custom lists).'
          }
        },
        required: ['file_path']
      }
    }
  }
};

export { apiTool };