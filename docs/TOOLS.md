# SuperCommerce MCP Tools Documentation

## Overview

This document provides comprehensive documentation for all 193 MCP tools available in the SuperCommerce Admin API integration.

Last Updated: 2025-09-25T21:09:25.152Z

## Business Model Categories

### Authentication (2 tools)

- `forget_password` - Forget Password
- `login` - Login

### Products (7 tools)

- `create_main_product` - Create Main Product
- `create_variant_product` - Create Variant Product
- `get_details_product_by_id` - Get Details Product By Id
- `get_product_list` - Get Product List
- `list_products_for_create_order` - List Products For Create Order
- `update_main_product` - Update Main Product
- `update_variant_product` - Update Variant Product

### Categories (5 tools)

- `create_category` - Create Category
- `edit_category_add_subcategory` - Edit Category Add Subcategory
- `get_all_category_dropdown` - Get All Category Dropdown
- `get_all_sub_categories_by_category_id_dropdown` - Get All Sub Categories By Category Id Dropdown
- `get_category_list_paginated` - Get Category List Paginated

### Brands (5 tools)

- `create_brand` - Create Brand
- `delete_brand` - Delete Brand
- `edit_brand` - Edit Brand
- `get_all_brands_list_dropdown` - Get All Brands List Dropdown
- `get_brands_list_paginated` - Get Brands List Paginated

### Options (5 tools)

- `create_option` - Create Option
- `delete_option` - Delete Option
- `edit_option` - Edit Option
- `get_all_options_list_dropdown` - Get All Options List Dropdown
- `get_options_list_paginated` - Get Options List Paginated

### Orders (9 tools)

- `create_order` - Create Order
- `edit_order` - Edit Order
- `edit_order_status` - Edit Order Status
- `list_cancelled_orders` - List Cancelled Orders
- `list_delivered_orders` - List Delivered Orders
- `list_order_status` - List Order Status
- `list_orders` - List Orders
- `list_placed_orders` - List Placed Orders
- `view_order` - View Order

### Customers (8 tools)

- `activate_customer` - Activate Customer
- `create_address` - Create Address
- `create_customer` - Create Customer
- `deactivate_customer` - Deactivate Customer
- `edit_customer` - Edit Customer
- `list_customer_groups` - List Customer Groups
- `list_customers` - List Customers
- `view_customer` - View Customer

### Groups (13 tools)

- `activate_group` - Activate Group
- `active_group` - Active Group
- `creat_new_group` - Creat New Group
- `create_group` - Create Group
- `deactivate_group` - Deactivate Group
- `deactive_group` - Deactive Group
- `export_groups` - Export Groups
- `export_groups_csv` - Export Groups Csv
- `get_groups_list` - Get Groups List
- `group_list` - Group List
- `import_group` - Import Group
- `import_groups` - Import Groups
- `update_group` - Update Group

### Custom Lists (9 tools)

- `create_custom_list` - Create Custom List
- `delete_custom_list` - Delete Custom List
- `edit_custom_list` - Edit Custom List
- `export_custom_list` - Export Custom List
- `export_custom_lists` - Export Custom Lists
- `get_custom_lists` - Get Custom Lists
- `import_custom_lists` - Import Custom Lists
- `import_cutom_list` - Import Cutom List
- `save_custom_list` - Save Custom List

### Inventory (1 tools)

- `list_inventories` - List Inventories

### Promotions (16 tools)

- `activate_promo_code` - Activate Promo Code
- `activate_promotion` - Activate Promotion
- `activate_reward` - Activate Reward
- `create_promo_code` - Create Promo Code
- `deactivate_promo_code` - Deactivate Promo Code
- `deactivate_promotion` - Deactivate Promotion
- `deactivate_rewards` - Deactivate Rewards
- `delete_promotion` - Delete Promotion
- `edit_promo_code` - Edit Promo Code
- `edite_promotion` - Edite Promotion
- `get_promo_code_list` - Get Promo Code List
- `get_promotions` - Get Promotions
- `get_rewards` - Get Rewards
- `new_promotion` - New Promotion
- `new_rewards` - New Rewards
- `view_promo_code` - View Promo Code

### Campaigns (6 tools)

- `create_campaign` - Create Campaign
- `delete_campaign` - Delete Campaign
- `get_campaign_details` - Get Campaign Details
- `get_campaigns` - Get Campaigns
- `update_campaign` - Update Campaign
- `view_campaign` - View Campaign

### Notifications (4 tools)

- `delete_notification` - Delete Notification
- `get_notifications` - Get Notifications
- `push_notification` - Push Notification
- `send_notification` - Send Notification

### Delivery (16 tools)

- `activate_delivery_manager` - Activate Delivery Manager
- `active_delivery_manager` - Active Delivery Manager
- `create_delivery_manager` - Create Delivery Manager
- `create_new_delivery_manager` - Create New Delivery Manager
- `deactivate_delivery_manager` - Deactivate Delivery Manager
- `export_delivery_managers` - Export Delivery Managers
- `get_delivery_manager_details` - Get Delivery Manager Details
- `get_delivery_managers` - Get Delivery Managers
- `get_edit_delivery_manager` - Get Edit Delivery Manager
- `get_pickup_details` - Get Pickup Details
- `get_pickups` - Get Pickups
- `import_delivery_manager` - Import Delivery Manager
- `pickups` - Pickups
- `save_edit_update_delivery_manager` - Save Edit Update Delivery Manager
- `update_delivery_manager` - Update Delivery Manager
- `view_delivery_details` - View Delivery Details

### Branches (10 tools)

- `activate_branch` - Activate Branch
- `branches_type` - Branches Type
- `create_branch` - Create Branch
- `create_new_branches` - Create New Branches
- `deactivate_branch` - Deactivate Branch
- `delete_branch` - Delete Branch
- `delete_branches` - Delete Branches
- `export_branches` - Export Branches
- `get_branches` - Get Branches
- `import_branches` - Import Branches

### Areas & Locations (15 tools)

- `activate_area` - Activate Area
- `activate_areas` - Activate Areas
- `activate_governorate` - Activate Governorate
- `create_area` - Create Area
- `create_governorate` - Create Governorate
- `deactivate_area` - Deactivate Area
- `deactivate_governorate` - Deactivate Governorate
- `delete_governorate` - Delete Governorate
- `export_cities` - Export Cities
- `get_areas` - Get Areas
- `get_governorates` - Get Governorates
- `import_cities` - Import Cities
- `list_cities` - List Cities
- `new_area` - New Area
- `new_governorate` - New Governorate

### Sections (7 tools)

- `activate_section` - Activate Section
- `create_new_section` - Create New Section
- `create_section` - Create Section
- `deactivate_section` - Deactivate Section
- `edit_section` - Edit Section
- `get_section_details` - Get Section Details
- `get_sections` - Get Sections

### Ads & Sliders (14 tools)

- `activate_ads` - Activate Ads
- `activate_custom_ad` - Activate Custom Ad
- `activate_slider` - Activate Slider
- `create_new_ad_slider` - Create New Ad Slider
- `deactivate_ads` - Deactivate Ads
- `deactivate_custom_ad` - Deactivate Custom Ad
- `deactivate_slider` - Deactivate Slider
- `delete_slider` - Delete Slider
- `edit_custom_ad` - Edit Custom Ad
- `get_custom_ads` - Get Custom Ads
- `get_sliders` - Get Sliders
- `manage_ads` - Manage Ads
- `update_custom_ads` - Update Custom Ads
- `update_slider` - Update Slider

### Pages & Content (17 tools)

- `create_new_static_page` - Create New Static Page
- `create_page` - Create Page
- `delete_page` - Delete Page
- `delete_static_page` - Delete Static Page
- `get_general_pages` - Get General Pages
- `get_landing_pages` - Get Landing Pages
- `get_page_details` - Get Page Details
- `get_pages` - Get Pages
- `get_website_policy` - Get Website Policy
- `get_your_pages` - Get Your Pages
- `update_about_page` - Update About Page
- `update_cookies_page` - Update Cookies Page
- `update_cookies_policy` - Update Cookies Policy
- `update_privacy_page` - Update Privacy Page
- `update_privacy_policy` - Update Privacy Policy
- `update_terms_and_conditions` - Update Terms And Conditions
- `update_terms_page` - Update Terms Page

### Menu (4 tools)

- `generate_menu` - Generate Menu
- `get_menu` - Get Menu
- `get_menu_creator` - Get Menu Creator
- `update_menu` - Update Menu

### Transactions (3 tools)

- `export_transactions` - Export Transactions
- `get_online_transactions` - Get Online Transactions
- `get_transactions` - Get Transactions

### Contact & Support (2 tools)

- `export_contact_us` - Export Contact Us
- `get_contact_us` - Get Contact Us

### Prescriptions (5 tools)

- `change_prescription_status` - Change Prescription Status
- `export_prescription` - Export Prescription
- `export_prescriptions` - Export Prescriptions
- `get_prescription` - Get Prescription
- `get_prescription_reasons` - Get Prescription Reasons

### Utilities (3 tools)

- `list_cancellation_reasons` - List Cancellation Reasons
- `list_payment_methods` - List Payment Methods
- `upload_image` - Upload Image

### Other (7 tools)

- `apply_changes` - Apply Changes
- `change_status` - Change Status
- `generate_from_categories` - Generate From Categories
- `get_gift_requests` - Get Gift Requests
- `new_request` - New Request
- `reset_password` - Reset Password
- `show_edit` - Show Edit

## 🆕 Recently Added Tools

- `listDeliveredOrders` - List delivered Orders

