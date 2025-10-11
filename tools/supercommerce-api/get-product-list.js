/**
 * Function to get product list.
 *
 * @param {Object} params - The parameters for get product list.
 * @param {string} params.page - The page.
 * @param {string} params.keyword_or_sku - The keyword or sku.
 * @param {string} [params.in_stock] - in stock.
 * @param {string} [params.active] - active.
 * @param {string} [params.category_id] - category id.
 * @param {string} [params.page] - page.
 * @param {string} [params.sub_category_id] - sub category id.
 * @param {string} [params.q] - q.
 * @param {string} [params.inventory_id] - inventory id.
 * @param {string} [params.parent_id] - parent id.

 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      page,
      keyword_or_sku,
      in_stock,
      active,
      category_id,
      sub_category_id,
      inventory_id,
      parent_id,
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('variant', '1'); // Always add variant=1
    queryParams.append('per_page', '10'); // Force limit page size to 10
    if (page !== undefined) queryParams.append('page', page);
    if (keyword_or_sku !== undefined) queryParams.append('q', keyword_or_sku);
    if (in_stock !== undefined) queryParams.append('in_stock', in_stock);
    if (active !== undefined) queryParams.append('active', active);
    if (category_id !== undefined) queryParams.append('category_id', category_id);
    if (sub_category_id !== undefined) queryParams.append('sub_category_id', sub_category_id);
    if (inventory_id !== undefined) queryParams.append('inventory_id', inventory_id);
    if (parent_id !== undefined) queryParams.append('parent_id', parent_id);

    let url = `${baseURL}/api/admin/v2/dropdown/products?${queryParams.toString()}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    const data = await response.json();

    // Transform response to match expected structure
    if (data && Array.isArray(data.data)) {
      data.data = data.data.map(product => {
        // Get image URL and ensure it's absolute
        let imageUrl = product.image || product.thumbnail || null;
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          // Remove leading slash if present
          imageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
          // Prepend base URL
          imageUrl = `${baseURL}/${imageUrl}`;
        }

        return {
          cart_step: product.cart_step || null,
          enable_step_package: product.enable_step_package || 0,
          id: product.id,
          name: product.name,
          name_ar: product.name_ar,
          name_en: product.name_en,
          options: product.options || [],
          price: product.price,
          sku: product.sku,
          step_package_label_ar: product.step_package_label_ar || null,
          step_package_label_en: product.step_package_label_en || null,
          step_unit_label_ar: product.step_unit_label_ar || null,
          step_unit_label_en: product.step_unit_label_en || null,
          stock: product.stock || "0",
          image: imageUrl
        };
      });
    }

    return data;
  } catch (error) {
    console.error('Error in getProductList:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for get product list.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_product_list',
      description: 'Get Product List',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'The page'
          },
          keyword_or_sku: {
            type: 'string',
            description: 'The keyword or sku'
          },
          in_stock: {
            type: 'string',
            description: 'in stock'
          },
          active: {
            type: 'string',
            description: 'active'
          },
          category_id: {
            type: 'string',
            description: 'category id'
          },
          sub_category_id: {
            type: 'string',
            description: 'sub category id'
          },
          q: {
            type: 'string',
            description: 'q'
          },
          inventory_id: {
            type: 'string',
            description: 'inventory id'
          },
          parent_id: {
            type: 'string',
            description: 'parent id'
          }
        },
        required: ['page', 'keyword_or_sku']
      },
      _meta: {
        'openai/outputTemplate': 'ui://widget/product-grid.html',
        'openai/toolInvocation/invoking': '🔍 Loading products...',
        'openai/toolInvocation/invoked': '✅ Products loaded successfully',
        'openai/widgetAccessible': true,
        'openai/resultCanProduceWidget': true
      }
    }
  }
};

export { apiTool };