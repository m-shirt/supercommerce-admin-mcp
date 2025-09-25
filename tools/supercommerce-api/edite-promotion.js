/**
 * Function to edite promotion.
 *
 * @param {Object} params - The parameters for edite promotion.
 * @param {string} params.id - The id.

 * @param {string} [params.title] - The title.
 * @param {string} [params.name] - The name.
 * @param {string} [params.name_ar] - The name ar.
 * @param {string} [params.gift_en] - The gift en.
 * @param {string} [params.gift_ar] - The gift ar.
 * @param {string} [params.active] - The active.
 * @param {string} [params.user_ids] - The user ids.
 * @param {string} [params.area_ids] - The area ids.
 * @param {string} [params.type] - The type.
 * @param {string} [params.times] - The times.
 * @param {string} [params.conditions] - The conditions.
 * @param {string} [params.targets] - The targets.
 * @param {string} [params.priority] - The priority.
 * @param {string} [params.discount_qty] - The discount qty.
 * @param {string} [params.discount] - The discount.
 * @param {string} [params.discount_condition_amount] - The discount condition amount.
 * @param {string} [params.start_date] - The start date.
 * @param {string} [params.expiration_date] - The expiration date.
 * @param {string} [params.discount_amount] - The discount amount.
 * @param {string} [params.target_amount] - The target amount.
 * @param {string} [params.different_brands] - The different brands.
 * @param {string} [params.different_categories] - The different categories.
 * @param {string} [params.different_products] - The different products.
 * @param {string} [params.override_discount] - The override discount.
 * @param {string} [params.check_all_conditions] - The check all conditions.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      id,
      title,
      name,
      name_ar,
      gift_en,
      gift_ar,
      active,
      user_ids,
      area_ids,
      type,
      times,
      conditions,
      targets,
      priority,
      discount_qty,
      discount,
      discount_condition_amount,
      start_date,
      expiration_date,
      discount_amount,
      target_amount,
      different_brands,
      different_categories,
      different_products,
      override_discount,
      check_all_conditions,
    } = params;

    let url = `${baseURL}/api/admin/promotions/${id}`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'title': title,
      'name': name,
      'name_ar': name_ar,
      'gift_en': gift_en,
      'gift_ar': gift_ar,
      'active': active,
      'user_ids': user_ids,
      'area_ids': area_ids,
      'type': type,
      'times': times,
      'conditions': conditions,
      'targets': targets,
      'priority': priority,
      'discount_qty': discount_qty,
      'discount': discount,
      'discount_condition_amount': discount_condition_amount,
      'start_date': start_date,
      'expiration_date': expiration_date,
      'discount_amount': discount_amount,
      'target_amount': target_amount,
      'different_brands': different_brands,
      'different_categories': different_categories,
      'different_products': different_products,
      'override_discount': override_discount,
      'check_all_conditions': check_all_conditions,
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
    console.error('Error in editePromotion:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for edite promotion.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edite_promotion',
      description: 'Edite Promotion',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id'
          },
          title: {
            type: 'string',
            description: 'The title'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          name_ar: {
            type: 'string',
            description: 'The name ar'
          },
          gift_en: {
            type: 'string',
            description: 'The gift en'
          },
          gift_ar: {
            type: 'string',
            description: 'The gift ar'
          },
          active: {
            type: 'string',
            description: 'The active'
          },
          user_ids: {
            type: 'string',
            description: 'The user ids'
          },
          area_ids: {
            type: 'string',
            description: 'The area ids'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          times: {
            type: 'string',
            description: 'The times'
          },
          conditions: {
            type: 'string',
            description: 'The conditions'
          },
          targets: {
            type: 'string',
            description: 'The targets'
          },
          priority: {
            type: 'string',
            description: 'The priority'
          },
          discount_qty: {
            type: 'string',
            description: 'The discount qty'
          },
          discount: {
            type: 'string',
            description: 'The discount'
          },
          discount_condition_amount: {
            type: 'string',
            description: 'The discount condition amount'
          },
          start_date: {
            type: 'string',
            description: 'The start date'
          },
          expiration_date: {
            type: 'string',
            description: 'The expiration date'
          },
          discount_amount: {
            type: 'string',
            description: 'The discount amount'
          },
          target_amount: {
            type: 'string',
            description: 'The target amount'
          },
          different_brands: {
            type: 'string',
            description: 'The different brands'
          },
          different_categories: {
            type: 'string',
            description: 'The different categories'
          },
          different_products: {
            type: 'string',
            description: 'The different products'
          },
          override_discount: {
            type: 'string',
            description: 'The override discount'
          },
          check_all_conditions: {
            type: 'string',
            description: 'The check all conditions'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };