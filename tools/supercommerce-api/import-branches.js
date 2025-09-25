/**
 * Function to import branches from a file.
 *
 * @param {Object} params - The parameters for importing branches.
 * @param {string} params.file_path - The path or URL to the file to import.
 * @param {string} [params.type] - The import type (default: "8" for branches).
 * @returns {Promise<Object>} - The result of the branches import.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { file_path, type = "8" } = params;

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
      const fileName = file_path.split('/').pop() || 'branches_import.csv';
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
    console.error('Error importing branches:', error);
    return { error: error.message || 'An error occurred while importing branches.' };
  }
};

/**
 * Tool configuration for importing branches.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'import_branches',
      description: 'Import branches from a CSV file. File must be accessible via URL.',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'URL to the CSV file containing branches data to import.'
          },
          type: {
            type: 'string',
            description: 'Import type identifier (default: "8" for branches).'
          }
        },
        required: ['file_path']
      }
    }
  }
};

export { apiTool };