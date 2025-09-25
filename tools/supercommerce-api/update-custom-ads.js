/**
 * Function to update custom ads.
 *
 * @param {Object} params - The parameters for update custom ads.
 * @param {string} params.custom_ads_id - The custom-ads id.

 * @param {string} [params.id] - The id.
 * @param {string} [params.type] - The type.
 * @param {string} [params.name_en] - The name en.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.link] - The link.
 * @param {string} [params.image_en] - The image en.
 * @param {string} [params.image_ar] - The image ar.
 * @param {string} [params.image_web] - The image web.
 * @param {string} [params.image_web_ar] - The image web ar.
 * @param {string} [params.dev_key] - The dev key.
 * @param {string} [params.prod] - The prod.
 * @param {string} [params.subCategory] - The subCategory.
 * @param {string} [params.brand] - The brand.
 * @param {string} [params.list_id] - The list id.
 * @param {string} [params.category] - The category.
 * @param {string} [params.vendor] - The vendor.
 * @param {string} [params.item_id] - The item id.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      custom_ads_id,
      id,
      type,
      name_en,
      name_ar,
      link,
      image_en,
      image_ar,
      image_web,
      image_web_ar,
      dev_key,
      prod,
      subCategory,
      brand,
      list_id,
      category,
      vendor,
      item_id,
    } = params;

    let url = `${baseURL}/api/admin/custom-ads/${custom-ads_id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'id': id,
      'type': type,
      'name_en': name_en,
      'name_ar': name_ar,
      'link': link,
      'image_en': image_en,
      'image_ar': image_ar,
      'image_web': image_web,
      'image_web_ar': image_web_ar,
      'dev_key': dev_key,
      'prod': prod,
      'subCategory': subCategory,
      'brand': brand,
      'list_id': list_id,
      'category': category,
      'vendor': vendor,
      'item_id': item_id,
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
    console.error('Error in updateCustomAds:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for update custom ads.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_custom_ads',
      description: 'Update Custom Ads',
      parameters: {
        type: 'object',
        properties: {
          custom_ads_id: {
            type: 'string',
            description: 'The custom-ads id'
          },
          id: {
            type: 'string',
            description: 'The id'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          name_en: {
            type: 'string',
            description: 'The name en'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          link: {
            type: 'string',
            description: 'The link'
          },
          image_en: {
            type: 'string',
            description: 'The image en'
          },
          image_ar: {
            type: 'string',
            description: 'The image ar'
          },
          image_web: {
            type: 'string',
            description: 'The image web'
          },
          image_web_ar: {
            type: 'string',
            description: 'The image web ar'
          },
          dev_key: {
            type: 'string',
            description: 'The dev key'
          },
          prod: {
            type: 'string',
            description: 'The prod'
          },
          subCategory: {
            type: 'string',
            description: 'The subCategory'
          },
          brand: {
            type: 'string',
            description: 'The brand'
          },
          list_id: {
            type: 'string',
            description: 'The list id'
          },
          category: {
            type: 'string',
            description: 'The category'
          },
          vendor: {
            type: 'string',
            description: 'The vendor'
          },
          item_id: {
            type: 'string',
            description: 'The item id'
          }
        },
        required: ['custom_ads_id']
      }
    }
  }
};

export { apiTool };