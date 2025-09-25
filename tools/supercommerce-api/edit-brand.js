/**
 * Function to edit brand.
 *
 * @param {Object} params - The parameters for edit brand.
 * @param {string} params.brand_d - The brand d.

 * @param {string} [params.id] - The id.
 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.slug] - The slug.
 * @param {string} [params.featured] - The featured.
 * @param {string} [params.image] - The image.
 * @param {string} [params.images] - The images.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      brand_d,
      id,
      name,
      name_ar,
      slug,
      featured,
      image,
      images,
    } = params;

    let url = `${baseURL}/api/admin/brands/${brand_d}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'id': id,
      'name': name,
      'name_ar': name_ar,
      'slug': slug,
      'featured': featured,
      'image': image,
      'images': images,
    };

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in editBrand:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edit brand.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_brand',
      description: 'Edit Brand',
      parameters: {
        type: 'object',
        properties: {
          brand_d: {
            type: 'string',
            description: 'The brand d'
          },
          id: {
            type: 'string',
            description: 'The id'
          },
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
          featured: {
            type: 'string',
            description: 'The featured'
          },
          image: {
            type: 'string',
            description: 'The image'
          },
          images: {
            type: 'string',
            description: 'The images'
          }
        },
        required: ['brand_d']
      }
    }
  }
};

export { apiTool };