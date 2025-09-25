/**
 * Function to import cities from a file.
 *
 * @param {Object} params - The parameters for importing cities.
 * @param {string} params.file_path - The path or URL to the file to import.
 * @param {string} [params.type] - The import type (default: "11" for cities).
 * @returns {Promise<Object>} - The result of the cities import.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { file_path, type = "11" } = params;

    const url = `${baseURL}/api/admin/v2/files/imports/import`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const formData = new FormData();

    if (file_path.startsWith('http')) {
      const fileResponse = await fetch(file_path);
      const fileBlob = await fileResponse.blob();
      const fileName = file_path.split('/').pop() || 'cities_import.csv';
      formData.append('file', fileBlob, fileName);
    } else {
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
    console.error('Error importing cities:', error);
    return { error: error.message || 'An error occurred while importing cities.' };
  }
};

/**
 * Tool configuration for importing cities.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'import_cities',
      description: 'Import cities from a CSV file. File must be accessible via URL.',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'URL to the CSV file containing cities data to import.'
          },
          type: {
            type: 'string',
            description: 'Import type identifier (default: "11" for cities).'
          }
        },
        required: ['file_path']
      }
    }
  }
};

export { apiTool };