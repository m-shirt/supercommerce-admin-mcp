/**
 * Function to create promo code.
 * Enhanced for better MCP client compatibility with sensible defaults.
 *
 * @param {Object} params - The parameters for create promo code.
 * @param {string} params.name - Unique name/code of the promo (required)
 * @param {string} params.description - Brief description of the promo (required)
 * @param {string} params.type - Type of promo (required)
 * @param {string} params.amount - Discount amount (required)
 * @param {string} [params.max_amount] - Maximum discount cap
 * @param {string} params.expiration_date - End date (required)
 * @param {string} params.start_date - Start date (required)
 * @param {string} [params.random_count] - Number of random codes to generate
 * @param {string} [params.minimum_amount] - Minimum order amount (defaults to '0')
 * @param {string} [params.uses_per_user] - Uses per user (defaults to '1')
 * @param {string} [params.usage_limit] - Total usage limit (defaults to '1000')
 * @param {string} [params.customer_phones] - Customer phones
 * @param {string} [params.target_type] - Target type (defaults to 'all')
 * @param {string} [params.work_with_promotion] - Work with promotion (defaults to '1')
 * @param {string} [params.first_order] - First order only (defaults to '0')
 * @param {string} [params.free_delivery] - Include free delivery (defaults to '0')
 * @param {string} [params.show_in_product] - Show in product (defaults to '1')
 * @param {string} [params.check_all_conditions] - Check all conditions (defaults to '0')
 * @param {string} [params.conditions] - Custom conditions
 * @param {string} [params.vendor_id] - Vendor ID
 * @param {string} [params.mobile_only] - Mobile only (defaults to '0')
 * @param {string} [params.payment_methods] - Payment methods
 * @param {string} [params.customer_ids] - Customer IDs
 * @param {string} [params.area_ids] - Area IDs
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
      area_ids,
    } = params;

    // Basic validation
    if (!name || !description || !type || !amount || !start_date || !expiration_date) {
      throw new Error('Missing required fields: name, description, type, amount, start_date, and expiration_date are required');
    }

    // Validate name format
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      throw new Error('Name must only contain alphanumeric characters and underscores (no spaces or special characters)');
    }

    // Validate type values
    const validTypes = ['1', '2', '3', '4'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid type. Use: 1 (percentage), 2 (fixed_amount), 3 (free_shipping), or 4 (buy_x_get_y)');
    }

    // Validate max_amount is provided for percentage type
    if (type === '1' && !max_amount) {
      throw new Error('max_amount is required when type is 1 (percentage discount)');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(expiration_date)) {
      throw new Error('Dates must be in YYYY-MM-DD format');
    }

    // Validate date logic
    if (new Date(start_date) > new Date(expiration_date)) {
      throw new Error('Start date must be before or equal to expiration date');
    }

    const url = `${baseURL}/api/admin/promos`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Build request data, excluding undefined values
    const requestData = {};

    // Required fields
    requestData.name = name;
    requestData.description = description;
    requestData.type = type;
    requestData.amount = amount;
    requestData.start_date = start_date;
    requestData.expiration_date = expiration_date;

    // Apply default values for fields that have sensible defaults for MCP clients
    requestData.show_in_product = show_in_product !== undefined ? show_in_product : '1';
    requestData.free_delivery = free_delivery !== undefined ? free_delivery : '0';
    requestData.work_with_promotion = work_with_promotion !== undefined ? work_with_promotion : '1';
    requestData.minimum_amount = minimum_amount !== undefined ? minimum_amount : '0';
    requestData.uses_per_user = uses_per_user !== undefined ? uses_per_user : '1';
    requestData.usage_limit = usage_limit !== undefined ? usage_limit : '1000';
    requestData.first_order = first_order !== undefined ? first_order : '0';
    requestData.mobile_only = mobile_only !== undefined ? mobile_only : '0';
    requestData.check_all_conditions = check_all_conditions !== undefined ? check_all_conditions : '0';
    requestData.target_type = target_type !== undefined ? target_type : 'all';

    // Optional fields - only include if provided
    if (max_amount !== undefined) requestData.max_amount = max_amount;
    if (random_count !== undefined) requestData.random_count = random_count;
    if (customer_phones !== undefined) requestData.customer_phones = customer_phones;
    if (conditions !== undefined) requestData.conditions = conditions;
    if (vendor_id !== undefined) requestData.vendor_id = vendor_id;
    if (payment_methods !== undefined) requestData.payment_methods = payment_methods;
    if (customer_ids !== undefined) requestData.customer_ids = customer_ids;
    if (area_ids !== undefined) requestData.area_ids = area_ids;


    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Provide helpful error messages
      let errorMessage = errorData.message || JSON.stringify(errorData);
      if (errorMessage.includes('type is invalid')) {
        errorMessage += ' - Use 1 (percentage), 2 (fixed), 3 (free shipping), or 4 (buy X get Y)';
      }
      if (errorMessage.includes('name must only contain')) {
        errorMessage += ' - Remove spaces and special characters from name field';
      }

      throw new Error(errorMessage);
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
      description: 'Create a new promotional coupon/discount code with support for percentage, fixed amount, free shipping, and more. Examples: SAVE10 (10% off), FLAT20 (20 EGP off), FREESHIP (free delivery)',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Unique name/code of the promo (e.g., "SAVE10"). Only alphanumeric and underscores allowed, no spaces',
            pattern: '^[A-Za-z0-9_]+$'
          },
          description: {
            type: 'string',
            description: 'Brief description of the promo (e.g., "10% off up to 50 EGP")'
          },
          type: {
            type: 'string',
            enum: ['1', '2', '3', '4'],
            description: 'Type of promo: 1=percentage discount (e.g., 10%), 2=fixed amount (e.g., 20 EGP off), 3=free shipping, 4=buy X get Y free'
          },
          amount: {
            type: 'string',
            description: 'Discount amount (e.g., "10" for 10%, or "25" for 25 EGP off). Required for types 1 and 2'
          },
          max_amount: {
            type: 'string',
            description: 'Maximum discount cap in currency (e.g., "50" to cap 10% at 50 EGP). Required for percentage type (type=1)'
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'Start date in YYYY-MM-DD format (e.g., "2024-04-05")'
          },
          expiration_date: {
            type: 'string',
            format: 'date',
            description: 'End date in YYYY-MM-DD format (e.g., "2025-04-05"). Must be >= start_date'
          },
          minimum_amount: {
            type: 'string',
            description: 'Minimum order amount to apply promo (e.g., "100" for 100 EGP minimum). Default: "0"',
            default: '0'
          },
          usage_limit: {
            type: 'string',
            description: 'Total number of times the promo can be used (e.g., "100"). Default: "1000"',
            default: '1000'
          },
          uses_per_user: {
            type: 'string',
            description: 'Number of times a single user can use the promo. Default: "1"',
            default: '1'
          },
          show_in_product: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Show promo banner on product page (1=yes, 0=no). Default: "1"',
            default: '1'
          },
          work_with_promotion: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Allow stacking with other promotions (1=yes, 0=no). Default: "1"',
            default: '1'
          },
          free_delivery: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Include free delivery (1=yes, 0=no). Default: "0"',
            default: '0'
          },
          mobile_only: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Only available on mobile apps (1=yes, 0=no). Default: "0"',
            default: '0'
          },
          first_order: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Only for first-time customers (1=yes, 0=no). Default: "0"',
            default: '0'
          },
          target_type: {
            type: 'string',
            enum: ['all', 'specific_customers', 'specific_areas', 'specific_vendors'],
            description: 'Who can use the promo. Default: "all"',
            default: 'all'
          },
          customer_ids: {
            type: 'string',
            description: 'Comma-separated customer IDs if target_type is "specific_customers"'
          },
          area_ids: {
            type: 'string',
            description: 'Comma-separated area IDs if target_type is "specific_areas"'
          },
          vendor_id: {
            type: 'string',
            description: 'Vendor ID if target_type is "specific_vendors"'
          },
          customer_phones: {
            type: 'string',
            description: 'Comma-separated customer phone numbers to restrict promo'
          },
          payment_methods: {
            type: 'string',
            description: 'Comma-separated payment method IDs to restrict promo to specific payment methods'
          },
          check_all_conditions: {
            type: 'string',
            enum: ['0', '1'],
            description: 'Require all conditions to be met (1=yes, 0=no). Default: "0"',
            default: '0'
          },
          conditions: {
            type: 'string',
            description: 'JSON string of custom conditions (advanced use)'
          },
          random_count: {
            type: 'string',
            description: 'Number of random promo codes to generate (if not set, one code is created)'
          }
        },
        required: ['name', 'description', 'type', 'amount', 'start_date', 'expiration_date']
      }
    }
  }
};

export { apiTool };