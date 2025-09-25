/**
 * Function to create brand.
 *
 * @param {Object} params - The parameters for create brand.


 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.slug] - The slug.
 * @param {string} [params.image] - The image.
 * @param {string} [params.featured] - The featured.
 * @param {string} [params.images] - The images.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      name_ar,
      slug,
      image,
      featured,
      images,
    } = params;

    const url = `${baseURL}/api/admin/brands`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'name_ar': name_ar,
      'slug': slug,
      'image': image,
      'featured': featured,
      'images': images,
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
    console.error('Error in createBrand:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create brand.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_brand',
      description: 'Create Brand',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          slug: {
            type: 'string',
            description: 'The slug'
          },
          image: {
            type: 'string',
            description: 'The image'
          },
          featured: {
            type: 'string',
            description: 'The featured'
          },
          images: {
            type: 'string',
            description: 'The images'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };