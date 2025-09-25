export const toolPaths = [
  'supercommerce-api/list-payment-methods.js',
  'supercommerce-api/create-promo-code.js',
  'supercommerce-api/edit-promo-code.js',
  'supercommerce-api/list-order-status.js',
  'supercommerce-api/list-cities.js',
  'supercommerce-api/list-cancellation-reasons.js',
  'supercommerce-api/view-order.js',
  'supercommerce-api/activate-promo-code.js',
  'supercommerce-api/deactivate-customer.js',
  'supercommerce-api/view-customer.js',
  'supercommerce-api/deactivate-promo-code.js',
  'supercommerce-api/activate-customer.js',
  'supercommerce-api/view-promo-code.js',
  'supercommerce-api/edit-order-status.js',
  'supercommerce-api/list-products-for-create-order.js',
  'supercommerce-api/get-promo-code-list.js',
  'supercommerce-api/list-orders.js',
  'supercommerce-api/list-customers.js',
  'supercommerce-api/create-customer.js',
  'supercommerce-api/edit-customer.js',
  'supercommerce-api/create-address.js',
  'supercommerce-api/edit-order.js',
  'supercommerce-api/create-order.js',
  'supercommerce-api/get-all-category-dropdown.js',
  'supercommerce-api/get-all-brands-list-dropdown.js',
  'supercommerce-api/get-all-options-list-dropdown.js',
  'supercommerce-api/list-inventories.js',
  'supercommerce-api/upload-image.js',
  'supercommerce-api/get-category-list-paginated.js',
  'supercommerce-api/get-brands-list-paginated.js',
  'supercommerce-api/get-options-list-paginated.js',
  'supercommerce-api/get-details-product-by-id.js',
  'supercommerce-api/edit-option.js',
  'supercommerce-api/get-all-sub-categories-by-category-id-dropdown.js',
  'supercommerce-api/update-variant-product.js',
  'supercommerce-api/list-products-for-create-order.js',
  'supercommerce-api/create-variant-product.js',
  'supercommerce-api/create-brand.js',
  'supercommerce-api/create-option.js',
  'supercommerce-api/edit-brand.js',
  'supercommerce-api/get-product-list.js',
  'supercommerce-api/create-main-product.js',
  'supercommerce-api/create-category.js',
  'supercommerce-api/update-main-product.js',
  'supercommerce-api/edit-category-add-subcategory.js',
  'supercommerce-api/list-customer-groups.js',

  // Groups Management APIs
  'supercommerce-api/get-groups-list.js',
  'supercommerce-api/activate-group.js',
  'supercommerce-api/create-group.js',
  'supercommerce-api/update-group.js',
  'supercommerce-api/deactivate-group.js',
  'supercommerce-api/import-groups.js',
  'supercommerce-api/export-groups.js',

  // Custom Lists Management APIs
  'supercommerce-api/get-custom-lists.js',
  'supercommerce-api/create-custom-list.js',
  'supercommerce-api/delete-custom-list.js',
  'supercommerce-api/edit-custom-list.js',
  'supercommerce-api/save-custom-list.js',
  'supercommerce-api/export-custom-lists.js',
  'supercommerce-api/import-custom-lists.js',

  // Store Front Management APIs - Sections
  'supercommerce-api/get-sections.js',
  'supercommerce-api/create-section.js',
  'supercommerce-api/get-section-details.js',
  'supercommerce-api/deactivate-section.js',
  'supercommerce-api/activate-section.js',
  'supercommerce-api/edit-section.js',

  // Store Front Management APIs - Custom Ads
  'supercommerce-api/get-custom-ads.js',
  'supercommerce-api/deactivate-custom-ad.js',
  'supercommerce-api/activate-custom-ad.js',
  'supercommerce-api/edit-custom-ad.js',

  // Store Front Management APIs - Pages & Ads
  'supercommerce-api/get-landing-pages.js',
  'supercommerce-api/manage-ads.js',

  // Branch Management APIs
  'supercommerce-api/get-branches.js',
  'supercommerce-api/create-branch.js',
  'supercommerce-api/delete-branch.js',
  'supercommerce-api/deactivate-branch.js',
  'supercommerce-api/activate-branch.js',
  'supercommerce-api/export-branches.js',
  'supercommerce-api/import-branches.js',

  // Static Pages Management APIs
  'supercommerce-api/get-pages.js',
  'supercommerce-api/get-page-details.js',
  'supercommerce-api/update-terms-page.js',
  'supercommerce-api/update-privacy-page.js',
  'supercommerce-api/update-about-page.js',
  'supercommerce-api/get-general-pages.js',
  'supercommerce-api/create-page.js',
  'supercommerce-api/delete-page.js',

  // Campaign Management APIs
  'supercommerce-api/get-campaigns.js',
  'supercommerce-api/create-campaign.js',
  'supercommerce-api/delete-campaign.js',
  'supercommerce-api/get-campaign-details.js',
  'supercommerce-api/update-campaign.js',

  // Menu Management APIs
  'supercommerce-api/get-menu.js',
  'supercommerce-api/update-menu.js',
  'supercommerce-api/generate-menu.js',

  // Phase 8+: High Priority APIs
  // Authentication
  'supercommerce-api/login.js',

  // Transactions Management APIs
  'supercommerce-api/get-transactions.js',
  'supercommerce-api/export-transactions.js',

  // Order Delivery Management APIs
  'supercommerce-api/get-pickups.js',
  'supercommerce-api/get-pickup-details.js',

  // Delivery Management APIs
  'supercommerce-api/get-delivery-managers.js',
  'supercommerce-api/create-delivery-manager.js',
  'supercommerce-api/get-delivery-manager-details.js',
  'supercommerce-api/update-delivery-manager.js',
  'supercommerce-api/activate-delivery-manager.js',
  'supercommerce-api/deactivate-delivery-manager.js',
  'supercommerce-api/export-delivery-managers.js',

  // Phase 12: Governorates & Areas Management APIs
  'supercommerce-api/get-governorates.js',
  'supercommerce-api/create-governorate.js',
  'supercommerce-api/activate-governorate.js',
  'supercommerce-api/deactivate-governorate.js',
  'supercommerce-api/delete-governorate.js',
  'supercommerce-api/get-areas.js',
  'supercommerce-api/create-area.js',
  'supercommerce-api/activate-area.js',
  'supercommerce-api/deactivate-area.js',
  'supercommerce-api/export-cities.js',
  'supercommerce-api/import-cities.js',

  // Phase 13: Contact Us Management APIs
  'supercommerce-api/get-contact-us.js',
  'supercommerce-api/export-contact-us.js',

  // Phase 14: Prescription Management APIs
  'supercommerce-api/get-prescription-reasons.js',
  'supercommerce-api/export-prescriptions.js',
  'supercommerce-api/change-prescription-status.js',

  // Phase 15: Marketing Promotions APIs
  'supercommerce-api/get-promotions.js',

  // Phase 16: Marketing Notifications APIs
  'supercommerce-api/get-notifications.js',
  'supercommerce-api/send-notification.js',
  'supercommerce-api/delete-notification.js',

  // Phase 17: Final Low Priority APIs (100% Coverage)
  'supercommerce-api/delete-option.js',
  'supercommerce-api/delete-brand.js',
  'supercommerce-api/update-cookies-page.js',

];