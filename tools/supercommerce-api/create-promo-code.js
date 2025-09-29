/**
 * Function to create promo code.
 *
 * @param {Object} params - The parameters for create promo code.


 * @param {string} [params.name] - The name.
 * @param {string} [params.description] - The description.
 * @param {string} [params.type] - The type.
 * @param {string} [params.amount] - The amount.
 * @param {string} [params.max_amount] - The max amount.
 * @param {string} [params.expiration_date] - The expiration date.
 * @param {string} [params.start_date] - The start date.
 * @param {string} [params.random_count] - The random count.
 * @param {string} [params.minimum_amount] - The minimum amount.
 * @param {string} [params.uses_per_user] - The uses per user.
 * @param {string} [params.usage_limit] - The usage limit.
 * @param {string} [params.customer_phones] - The customer phones.
 * @param {string} [params.target_type] - The target type.
 * @param {string} [params.work_with_promotion] - The work with promotion.
 * @param {string} [params.first_order] - The first order.
 * @param {string} [params.free_delivery] - The free delivery.
 * @param {string} [params.show_in_product] - The show in product.
 * @param {string} [params.check_all_conditions] - The check all conditions.
 * @param {string} [params.conditions] - The conditions.
 * @param {string} [params.vendor_id] - The vendor id.
 * @param {string} [params.mobile_only] - The mobile only.
 * @param {string} [params.payment_methods] - The payment methods.
 * @param {string} [params.customer_ids] - The customer ids.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      name,
      description,
      type,
      amount,
      max_amount,
      expiration_date,
      start_date,
      random_count,
      minimum_amount,
      uses_per_user,
      usage_limit,
      customer_phones,
      target_type,
      work_with_promotion,
      first_order,
      free_delivery,
      show_in_product,
      check_all_conditions,
      conditions,
      vendor_id,
      mobile_only,
      payment_methods,
      customer_ids,
    } = params;

    const url = `${baseURL}/api/admin/promos`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'description': description,
      'type': type,
      'amount': amount,
      'max_amount': max_amount,
      'expiration_date': expiration_date,
      'start_date': start_date,
      'random_count': random_count,
      'minimum_amount': minimum_amount,
      'uses_per_user': uses_per_user,
      'usage_limit': usage_limit,
      'customer_phones': customer_phones,
      'target_type': target_type,
      'work_with_promotion': work_with_promotion,
      'first_order': first_order,
      'free_delivery': free_delivery,
      'show_in_product': show_in_product,
      'check_all_conditions': check_all_conditions,
      'conditions': conditions,
      'vendor_id': vendor_id,
      'mobile_only': mobile_only,
      'payment_methods': payment_methods,
      'customer_ids': customer_ids,
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
    console.error('Error in createPromoCode:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_promo_code',
      description: 'Create Promo Code',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name'
          },
          description: {
            type: 'string',
            description: 'The description'
          },
          type: {
            type: 'string',
            description: 'The type'
          },
          amount: {
            type: 'string',
            description: 'The amount'
          },
          max_amount: {
            type: 'string',
            description: 'The max amount'
          },
          expiration_date: {
            type: 'string',
            description: 'The expiration date'
          },
          start_date: {
            type: 'string',
            description: 'The start date'
          },
          random_count: {
            type: 'string',
            description: 'The random count'
          },
          minimum_amount: {
            type: 'string',
            description: 'The minimum amount'
          },
          uses_per_user: {
            type: 'string',
            description: 'The uses per user'
          },
          usage_limit: {
            type: 'string',
            description: 'The usage limit'
          },
          customer_phones: {
            type: 'string',
            description: 'The customer phones'
          },
          target_type: {
            type: 'string',
            description: 'The target type'
          },
          work_with_promotion: {
            type: 'string',
            description: 'The work with promotion'
          },
          first_order: {
            type: 'string',
            description: 'The first order'
          },
          free_delivery: {
            type: 'string',
            description: 'The free delivery'
          },
          show_in_product: {
            type: 'string',
            description: 'The show in product'
          },
          check_all_conditions: {
            type: 'string',
            description: 'The check all conditions'
          },
          conditions: {
            type: 'string',
            description: 'The conditions'
          },
          vendor_id: {
            type: 'string',
            description: 'The vendor id'
          },
          mobile_only: {
            type: 'string',
            description: 'The mobile only'
          },
          payment_methods: {
            type: 'string',
            description: 'The payment methods'
          },
          customer_ids: {
            type: 'string',
            description: 'The customer ids'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };