/**
 * Function to create variant product.
 *
 * @param {Object} params - The parameters for create variant product.
 * @param {string} params.id - The id.

 * @param {string} [params.product_with_variant] - The product with variant.
 * @param {string} [params.description] - The description.
 * @param {string} [params.description_ar] - The description ar.
 * @param {string} [params.image] - The image.
 * @param {string} [params.images] - The images.
 * @param {string} [params.order] - The order.
 * @param {string} [params.long_description_ar] - The long description ar.
 * @param {string} [params.long_description_en] - The long description en.
 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.meta_title] - The meta title.
 * @param {string} [params.meta_description] - The meta description.
 * @param {string} [params.meta_title_ar] - The meta title ar.
 * @param {string} [params.meta_description_ar] - The meta description ar.
 * @param {string} [params.options] - The options.
 * @param {string} [params.free_delivery] - The free delivery.
 * @param {string} [params.disable_free_delivery] - The disable free delivery.
 * @param {string} [params.sku] - The sku.
 * @param {string} [params.barcode] - The barcode.
 * @param {string} [params.inventories] - The inventories.
 * @param {string} [params.weight] - The weight.
 * @param {string} [params.slug] - The slug.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      id,
      product_with_variant,
      description,
      description_ar,
      image,
      images,
      order,
      long_description_ar,
      long_description_en,
      name,
      name_ar,
      meta_title,
      meta_description,
      meta_title_ar,
      meta_description_ar,
      options,
      free_delivery,
      disable_free_delivery,
      sku,
      barcode,
      inventories,
      weight,
      slug,
    } = params;

    let url = `${baseURL}/api/admin/products/${id}/variants`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'product_with_variant': product_with_variant,
      'description': description,
      'description_ar': description_ar,
      'image': image,
      'images': images,
      'order': order,
      'long_description_ar': long_description_ar,
      'long_description_en': long_description_en,
      'name': name,
      'name_ar': name_ar,
      'meta_title': meta_title,
      'meta_description': meta_description,
      'meta_title_ar': meta_title_ar,
      'meta_description_ar': meta_description_ar,
      'options': options,
      'free_delivery': free_delivery,
      'disable_free_delivery': disable_free_delivery,
      'sku': sku,
      'barcode': barcode,
      'inventories': inventories,
      'weight': weight,
      'slug': slug,
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
    console.error('Error in createVariantProduct:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create variant product.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_variant_product',
      description: 'Create Variant Product',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id'
          },
          product_with_variant: {
            type: 'string',
            description: 'The product with variant'
          },
          description: {
            type: 'string',
            description: 'The description'
          },
          description_ar: {
            type: 'string',
            description: 'The description ar'
          },
          image: {
            type: 'string',
            description: 'The image'
          },
          images: {
            type: 'string',
            description: 'The images'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          long_description_ar: {
            type: 'string',
            description: 'The long description ar'
          },
          long_description_en: {
            type: 'string',
            description: 'The long description en'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          meta_title: {
            type: 'string',
            description: 'The meta title'
          },
          meta_description: {
            type: 'string',
            description: 'The meta description'
          },
          meta_title_ar: {
            type: 'string',
            description: 'The meta title ar'
          },
          meta_description_ar: {
            type: 'string',
            description: 'The meta description ar'
          },
          options: {
            type: 'string',
            description: 'The options'
          },
          free_delivery: {
            type: 'string',
            description: 'The free delivery'
          },
          disable_free_delivery: {
            type: 'string',
            description: 'The disable free delivery'
          },
          sku: {
            type: 'string',
            description: 'The sku'
          },
          barcode: {
            type: 'string',
            description: 'The barcode'
          },
          inventories: {
            type: 'string',
            description: 'The inventories'
          },
          weight: {
            type: 'string',
            description: 'The weight'
          },
          slug: {
            type: 'string',
            description: 'The slug'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };