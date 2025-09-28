/**
 * Function to create address.
 *
 * @param {Object} params - The parameters for create address.
 * @param {string} params.cutomer_id - The cutomer id.

 * @param {string} [params.name] - The name.
 * @param {string} [params.address] - The address.
 * @param {string} [params.city_id] - The city id.
 * @param {string} [params.area_id] - The area id.
 * @param {string} [params.landmark] - The landmark.
 * @param {string} [params.building] - The building.
 * @param {string} [params.phone] - The phone.
 * @param {string} [params.floor] - The floor.
 * @param {string} [params.apartment] - The apartment.
 * @param {string} [params.shop_name] - The shop name.
 * @param {string} [params.commercial_record] - The commercial record.
 * @param {string} [params.bank_account] - The bank account.
 * @param {string} [params.contact_number] - The contact number.
 * @param {string} [params.shop_image] - The shop image.
 * @param {string} [params.attachment_2] - The attachment 2.
 * @param {string} [params.attachment_3] - The attachment 3.
 * @param {string} [params.email] - The email.
 * @param {string} [params.lat] - The lat.
 * @param {string} [params.lng] - The lng.
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
      cutomer_id,
      name,
      address,
      city_id,
      area_id,
      landmark,
      building,
      phone,
      floor,
      apartment,
      shop_name,
      commercial_record,
      bank_account,
      contact_number,
      shop_image,
      attachment_2,
      attachment_3,
      email,
      lat,
      lng,
    } = params;

    let url = `${baseURL}/api/admin/customers/${cutomer_id}/address`;
    

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const requestData = {
      'name': name,
      'address': address,
      'city_id': city_id,
      'area_id': area_id,
      'landmark': landmark,
      'building': building,
      'phone': phone,
      'floor': floor,
      'apartment': apartment,
      'shop_name': shop_name,
      'commercial_record': commercial_record,
      'bank_account': bank_account,
      'contact_number': contact_number,
      'shop_image': shop_image,
      'attachment_2': attachment_2,
      'attachment_3': attachment_3,
      'email': email,
      'lat': lat,
      'lng': lng,
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
    console.error('Error in createAddress:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for create address.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_address',
      description: 'Create Address',
      parameters: {
        type: 'object',
        properties: {
          cutomer_id: {
            type: 'string',
            description: 'The cutomer id'
          },
          name: {
            type: 'string',
            description: 'The name'
          },
          address: {
            type: 'string',
            description: 'The address'
          },
          city_id: {
            type: 'string',
            description: 'The city id'
          },
          area_id: {
            type: 'string',
            description: 'The area id'
          },
          landmark: {
            type: 'string',
            description: 'The landmark'
          },
          building: {
            type: 'string',
            description: 'The building'
          },
          phone: {
            type: 'string',
            description: 'The phone'
          },
          floor: {
            type: 'string',
            description: 'The floor'
          },
          apartment: {
            type: 'string',
            description: 'The apartment'
          },
          shop_name: {
            type: 'string',
            description: 'The shop name'
          },
          commercial_record: {
            type: 'string',
            description: 'The commercial record'
          },
          bank_account: {
            type: 'string',
            description: 'The bank account'
          },
          contact_number: {
            type: 'string',
            description: 'The contact number'
          },
          shop_image: {
            type: 'string',
            description: 'The shop image'
          },
          attachment_2: {
            type: 'string',
            description: 'The attachment 2'
          },
          attachment_3: {
            type: 'string',
            description: 'The attachment 3'
          },
          email: {
            type: 'string',
            description: 'The email'
          },
          lat: {
            type: 'string',
            description: 'The lat'
          },
          lng: {
            type: 'string',
            description: 'The lng'
          }
        },
        required: ['cutomer_id']
      }
    }
  }
};

export { apiTool };