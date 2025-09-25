/**
 * Function to update slider.
 *
 * @param {Object} params - The parameters for update slider.
 * @param {string} params.id - The id.

 * @param {string} [params.id] - The id.
 * @param {string} [params.type] - The type.
 * @param {string} [params.popup] - The popup.
 * @param {string} [params.order] - The order.
 * @param {string} [params.banner_ad] - The banner ad.
 * @param {string} [params.link] - The link.
 * @param {string} [params.vendor] - The vendor.
 * @param {string} [params.banner_title] - The banner title.
 * @param {string} [params.banner_title_ar] - The banner title ar.
 * @param {string} [params.banner_description] - The banner description.
 * @param {string} [params.banner_description_ar] - The banner description ar.
 * @param {string} [params.image] - The image.
 * @param {string} [params.image_ar] - The image ar.
 * @param {string} [params.image_web] - The image web.
 * @param {string} [params.image_web_ar] - The image web ar.
 * @param {string} [params.prod] - The prod.
 * @param {string} [params.subCategory] - The subCategory.
 * @param {string} [params.brand] - The brand.
 * @param {string} [params.landing_page_id] - The landing page id.
 * @param {string} [params.list_id] - The list id.
 * @param {string} [params.category] - The category.
 * @param {string} [params.start_date] - The start date.
 * @param {string} [params.start_time] - The start time.
 * @param {string} [params.end_date] - The end date.
 * @param {string} [params.expiration_time] - The expiration time.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      id,
      type,
      popup,
      order,
      banner_ad,
      link,
      vendor,
      banner_title,
      banner_title_ar,
      banner_description,
      banner_description_ar,
      image,
      image_ar,
      image_web,
      image_web_ar,
      prod,
      subCategory,
      brand,
      landing_page_id,
      list_id,
      category,
      start_date,
      start_time,
      end_date,
      expiration_time,
    } = params;

    let url = `${baseURL}/api/admin/ads/${id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'id': id,
      'type': type,
      'popup': popup,
      'order': order,
      'banner_ad': banner_ad,
      'link': link,
      'vendor': vendor,
      'banner_title': banner_title,
      'banner_title_ar': banner_title_ar,
      'banner_description': banner_description,
      'banner_description_ar': banner_description_ar,
      'image': image,
      'image_ar': image_ar,
      'image_web': image_web,
      'image_web_ar': image_web_ar,
      'prod': prod,
      'subCategory': subCategory,
      'brand': brand,
      'landing_page_id': landing_page_id,
      'list_id': list_id,
      'category': category,
      'start_date': start_date,
      'start_time': start_time,
      'end_date': end_date,
      'expiration_time': expiration_time,
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
    console.error('Error in updateSlider:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for update slider.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_slider',
      description: 'Update Slider',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          popup: {
            type: 'string',
            description: 'The popup'
          },
          order: {
            type: 'string',
            description: 'The order'
          },
          banner_ad: {
            type: 'string',
            description: 'The banner ad'
          },
          link: {
            type: 'string',
            description: 'The link'
          },
          vendor: {
            type: 'string',
            description: 'The vendor'
          },
          banner_title: {
            type: 'string',
            description: 'The banner title'
          },
          banner_title_ar: {
            type: 'string',
            description: 'The banner title ar'
          },
          banner_description: {
            type: 'string',
            description: 'The banner description'
          },
          banner_description_ar: {
            type: 'string',
            description: 'The banner description ar'
          },
          image: {
            type: 'string',
            description: 'The image'
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
          landing_page_id: {
            type: 'string',
            description: 'The landing page id'
          },
          list_id: {
            type: 'string',
            description: 'The list id'
          },
          category: {
            type: 'string',
            description: 'The category'
          },
          start_date: {
            type: 'string',
            description: 'The start date'
          },
          start_time: {
            type: 'string',
            description: 'The start time'
          },
          end_date: {
            type: 'string',
            description: 'The end date'
          },
          expiration_time: {
            type: 'string',
            description: 'The expiration time'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };