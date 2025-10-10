/**
 * Function to create main product.
 *
 * @param {Object} params - The parameters for create main product.


 * @param {string} [params.brand_id] - The brand id.
 * @param {string} [params.category_id] - The category id.
 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.preorder] - The preorder.
 * @param {string} [params.available_soon] - The available soon.
 * @param {string} [params.bundle_checkout] - The bundle checkout.
 * @param {string} [params.product_variant_options] - The product variant options.
 * @param {string} [params.sku] - The sku.
 * @param {string} [params.type] - The type.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      brand_id,
      category_id,
      name,
      name_ar,
      preorder,
      available_soon,
      bundle_checkout,
      product_variant_options,
      sku,
      type,
    } = params;

    const url = `${baseURL}/api/admin/products`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'brand_id': brand_id,
      'category_id': category_id,
      'name': name,
      'name_ar': name_ar,
      'preorder': preorder,
      'available_soon': available_soon,
      'bundle_checkout': bundle_checkout,
      'product_variant_options': product_variant_options,
      'sku': sku,
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
    console.error('Error in createMainProduct:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create main product.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_main_product',
      description: 'Create Main Product',
      _meta: {
        'openai/outputTemplate': 'ui://widget/product-creation.html',
        'openai/toolInvocation/invoking': 'Creating product...',
        'openai/toolInvocation/invoked': 'Product created successfully',
        'openai/widgetAccessible': true,
        'openai/resultCanProduceWidget': true
      },
      parameters: {
        type: 'object',
        properties: {
          brand_id: {
            type: 'string',
            description: 'The brand id'
          },
          category_id: {
            type: 'string',
            description: 'The category id'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          preorder: {
            type: 'string',
            description: 'The preorder'
          },
          available_soon: {
            type: 'string',
            description: 'The available soon'
          },
          bundle_checkout: {
            type: 'string',
            description: 'The bundle checkout'
          },
          product_variant_options: {
            type: 'string',
            description: 'The product variant options'
          },
          sku: {
            type: 'string',
            description: 'The sku'
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