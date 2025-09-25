const productInstructions = `
PRODUCT CREATION WORKFLOW FOR SUPERCOMMERCE

1. PRODUCT CREATION SEQUENCE:
   - ALWAYS create main product FIRST using create_main_product
   - THEN create variant(s) using create_variant_product
   - Main product SKU format: main_{{sku}}
   - Variant SKU format: {{sku}} (without "main_" prefix)

2. MAIN PRODUCT CREATION:
   Required fields:
   - brand_id: Get from get-all-brands-list-dropdown
   - category_id: Get from get-all-category-dropdown
   - name: Product name in English
   - name_ar: Product name in Arabic
   - sku: Unique product identifier
   - type: "1" for regular product, "2" for bundle (default is "1")
   - available_soon: boolean (true/false)
   - bundle_checkout: boolean (true/false)

   Optional fields:
   - preorder: integer (0 or 1)
   - product_variant_options: Array of option IDs for variants (e.g., color, size)

3. VARIANT PRODUCT CREATION:
   Required fields:
   - main_id: ID returned from main product creation
   - product_with_variant: Set to true when called after creating main product
   - description: HTML description in English
   - description_ar: HTML description in Arabic
   - image: Main image URL
   - name: Variant name in English
   - name_ar: Variant name in Arabic
   - options: Array of {option_id, option_value_id} pairs
   - free_delivery: boolean
   - disable_free_delivery: boolean
   - sku: Variant SKU (without "main_" prefix)
   - barcode: Product barcode
   - inventories: Array with inventory data (see below)
   - weight: Product weight in grams/kg
   - order: Display order number

   Optional fields:
   - images: Array of additional image objects with url property
   - long_description_en: Long English description (HTML)
   - long_description_ar: Long Arabic description (HTML)
   - meta_title, meta_description: SEO fields
   - meta_title_ar, meta_description_ar: Arabic SEO fields
   - slug: Custom URL slug (only if user wants to customize)

4. INVENTORY CONFIGURATION:
   Each inventory object must include:
   - id: Inventory location ID (get from list-inventories)
   - stock: Stock quantity as string
   - prices: Array of price objects for different customer groups

   Price object structure:
   - customer_group_id: Get from list-customer-groups
   - price: Base price as string
   - discount_price: Discounted price (optional)
   - discount_price_amount_type: "fixed" or "percentage"
   - discount_price_percentage: Percentage value (e.g., "10" for 10%)
   - discount_start_date: Format "YYYY-MM-DD HH:MM"
   - discount_end_date: Format "YYYY-MM-DD HH:MM"

5. VARIANT OPTIONS SETUP:
   - If product has multiple variants (colors, sizes, etc.), add product_variant_options in main product
   - Get option IDs from get-all-options-list-dropdown
   - When creating variants, specify exact option values in options array
   - This allows customers to select between different variants

6. DATA GATHERING WORKFLOW:
   Before creating products, gather required data:
   a. Call list-inventories to get inventory IDs
   b. Call list-customer-groups to get customer group IDs
   c. Call get-all-brands-list-dropdown for brand selection
   d. Call get-all-category-dropdown for category selection
   e. Call get-all-options-list-dropdown if using variants

7. ERROR HANDLING:
   - Always check API responses for errors
   - If main product creation fails, don't proceed to variants
   - Validate all required fields before API calls
   - Handle authentication errors appropriately

8. EXAMPLE WORKFLOW:
   1. User requests to create a product
   2. Gather inventory and customer group data
   3. Create main product with basic info
   4. Create variant with detailed info, pricing, and inventory
   5. Confirm successful creation to user

FUNCTION NAMES TO USE:
- create_main_product
- create_variant_product
- list-inventories
- list-customer-groups
- get-all-brands-list-dropdown
- get-all-category-dropdown
- get-all-options-list-dropdown
`;

const productCreationPrompt = {
  id: "product-creation-flow",
  metadata: {
    title: "Product Creation Flow and Instructions",
    description: "Explains the workflow for creating main products and variants in Supercommerce",
    argsSchema: [] // no input required
  },
  handler: () => ({
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: productInstructions
        }
      }
    ]
  })
};

export default productCreationPrompt;