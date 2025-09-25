# Missing APIs Implementation Plan

## Analysis Summary
After analyzing the **Backend APIs.postman_collection.json** file and comparing it with existing tools in `tools/supercommerce-api/`, I've identified **60+ missing APIs** across multiple categories that need to be implemented.

## Current Tool Coverage
**Existing (42 tools):** Products, Orders, Customers, Basic CRUD operations
**Missing:** Advanced management features, store configuration, analytics, file operations

## Missing API Categories & Tools to Implement

### 1. **Groups Management (7 APIs)** - ✅ **COMPLETED**
- [x] `get-groups-list` - GET /api/admin/v2/groups
- [x] `activate-group` - POST /api/admin/groups/{id}/activate
- [x] `create-group` - POST /api/admin/groups
- [x] `import-groups` - POST /api/admin/v2/files/imports/import
- [x] `export-groups` - POST /api/admin/v2/files/exports/export
- [x] `update-group` - POST /api/admin/groups/{id}
- [x] `deactivate-group` - POST /api/admin/groups/{id}/deactivate

### 2. **Custom Lists Management (7 APIs)** - ✅ **COMPLETED**
- [x] `get-custom-lists` - GET /api/admin/lists
- [x] `create-custom-list` - POST /api/admin/lists
- [x] `delete-custom-list` - DELETE /api/admin/lists/{id}
- [x] `edit-custom-list` - PUT /api/admin/lists/{id}
- [x] `save-custom-list` - POST /api/admin/lists/{id}
- [x] `export-custom-lists` - POST /api/admin/v2/files/exports/export
- [x] `import-custom-lists` - POST /api/admin/v2/files/imports/import

### 3. **Store Front Management (12 APIs)** - ✅ **COMPLETED**
- [x] `get-sections` - GET /api/admin/sections
- [x] `create-section` - POST /api/admin/sections
- [x] `get-section-details` - GET /api/admin/sections/{id}
- [x] `deactivate-section` - POST /api/admin/sections/{id}/deactivate
- [x] `activate-section` - POST /api/admin/sections/{id}/activate
- [x] `edit-section` - PUT /api/admin/sections/{id}
- [x] `get-custom-ads` - GET /api/admin/custom-ads
- [x] `deactivate-custom-ad` - POST /api/admin/custom-ads/{id}/deactivate
- [x] `activate-custom-ad` - POST /api/admin/custom-ads/{id}/activate
- [x] `edit-custom-ad` - PUT /api/admin/custom-ads/{id}
- [x] `get-landing-pages` - GET /api/admin/pages/all
- [x] `manage-ads` - GET/POST/PUT /api/admin/ads

### 4. **Branch Management (7 APIs)** - MEDIUM PRIORITY
- [ ] `get-branches` - GET /api/admin/branches
- [ ] `create-branch` - POST /api/admin/branches
- [ ] `delete-branch` - DELETE /api/admin/branches/{id}/delete
- [ ] `deactivate-branch` - POST /api/admin/branches/{id}/deactivate
- [ ] `activate-branch` - POST /api/admin/branches/{id}/activate
- [ ] `export-branches` - POST /api/admin/v2/files/exports/export
- [ ] `import-branches` - POST /api/admin/v2/files/imports/import

### 5. **Static Pages Management (8 APIs)** - MEDIUM PRIORITY
- [ ] `get-pages` - GET /api/admin/pages
- [ ] `get-page-details` - GET /api/admin/pages/{id}/show
- [ ] `update-terms-page` - POST /api/admin/pages/1/update
- [ ] `update-privacy-page` - POST /api/admin/pages/2/update
- [ ] `update-about-page` - POST /api/admin/pages/3/update
- [ ] `get-general-pages` - GET /api/admin/pages?flag=general
- [ ] `create-page` - POST /api/admin/pages/store
- [ ] `delete-page` - DELETE /api/admin/pages/{id}/delete

### 6. **Campaign Management (5 APIs)** - MEDIUM PRIORITY
- [ ] `get-campaigns` - GET /api/admin/campaigns
- [ ] `create-campaign` - POST /api/admin/campaigns
- [ ] `delete-campaign` - DELETE /api/admin/campaigns/{id}/delete
- [ ] `get-campaign-details` - GET /api/admin/campaigns/{id}
- [ ] `update-campaign` - PUT /api/admin/campaigns/{id}/update

### 7. **Transaction Management (2 APIs)** - LOW PRIORITY
- [ ] `get-transactions` - GET /api/admin/transactions
- [ ] `export-transactions` - POST /api/admin/v2/files/exports/export

### 8. **Contact & Support (2 APIs)** - LOW PRIORITY
- [ ] `get-contact-messages` - GET /api/admin/contact_us
- [ ] `export-contact-messages` - POST /api/admin/v2/files/exports/export

### 9. **Pickup Management (2 APIs)** - LOW PRIORITY
- [ ] `get-pickups` - GET /api/admin/pickups
- [ ] `get-pickup-details` - GET /api/admin/pickups/{id}

### 10. **Customer Advanced Features (2 APIs)** - LOW PRIORITY
- [ ] `search-customers-advanced` - GET /api/admin/v2/customers/search
- [ ] `export-customers` - POST /api/admin/v2/files/exports/export

### 11. **Prescription Management (2 APIs)** - LOW PRIORITY
- [ ] `get-prescription-cancellation-reasons` - GET /api/admin/prescription_cancellation_reasons
- [ ] `change-prescription-status` - POST /api/admin/prescriptions/{id}/change_status

### 12. **Menu Management (3 APIs)** - MEDIUM PRIORITY
- [ ] `get-menu` - GET /api/admin/menu
- [ ] `update-menu` - POST /api/admin/menu
- [ ] `generate-menu` - POST /api/admin/menu/generate

### 13. **Deliverer Management (6 APIs)** - LOW PRIORITY
- [ ] `get-deliverers` - GET /api/admin/v2/deliverers
- [ ] `create-deliverer` - POST /api/admin/deliverers
- [ ] `get-deliverer-details` - GET /api/admin/v2/deliverers/{id}
- [ ] `update-deliverer` - PUT /api/admin/deliverers/{id}
- [ ] `export-deliverers` - POST /api/admin/v2/files/exports/export
- [ ] `import-deliverers` - POST /api/admin/v2/files/imports/import

## Implementation Strategy

1. **Create tool files** following existing patterns in `tools/supercommerce-api/`
2. **Update tool registry** in `tools/paths.js`
3. **Validate schemas** using `validateTools.js`
4. **Test functionality** via web interface at http://localhost:3000

## Priority Implementation Order
1. **HIGH PRIORITY:** Groups (7), Custom Lists (7), Store Front (12) - **26 tools**
2. **MEDIUM PRIORITY:** Branches (7), Pages (8), Campaigns (5), Menu (3) - **23 tools**
3. **LOW PRIORITY:** Analytics, Advanced reporting, Support (13 tools) - **13 tools**

## Tool Structure Pattern
Each tool follows this consistent structure:
```javascript
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/endpoint`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'GET/POST/PUT/DELETE',
      headers,
      body: method !== 'GET' ? JSON.stringify(params) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message || 'An error occurred' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'tool_name',
      description: 'Tool description',
      parameters: {
        type: 'object',
        properties: { /* JSON Schema */ },
        required: ['param1', 'param2']
      }
    }
  }
};

export { apiTool };
```

## Progress Tracking
- **Total APIs to Implement:** 62
- **✅ HIGH PRIORITY COMPLETED:** 26 tools ✅
  - ✅ Groups Management: 7 tools
  - ✅ Custom Lists Management: 7 tools
  - ✅ Store Front Management: 12 tools
- **Medium Priority (Next Phase):** 23 tools
- **Low Priority (Future Phase):** 13 tools

## ✅ **CURRENT STATUS: PHASE 1 & 2 COMPLETED**
- **Original Tools:** 42 tools
- **Phase 1 Added:** +14 tools (Groups & Custom Lists)
- **Phase 2 Added:** +12 tools (Store Front Management)
- **Current Total:** **68 tools** 🎉

This implementation has expanded the MCP server from 42 tools to **68 tools** (+26 high-priority APIs), providing comprehensive e-commerce management capabilities for groups, custom lists, and store front components.

## Testing Strategy
1. **Schema Validation:** Run `node validateTools.js` after each batch
2. **Functional Testing:** Use web interface at http://localhost:3000
3. **MCP Inspector:** Use `npx @modelcontextprotocol/inspector node mcpServer.js`
4. **Integration Testing:** Test with Claude Desktop after implementation

## Completion Checklist
- [ ] All tool files created in `tools/supercommerce-api/`
- [ ] Tool paths added to `tools/paths.js`
- [ ] Schema validation passes
- [ ] Web interface testing completed
- [ ] Documentation updated in CLAUDE.md
- [ ] Changes committed and pushed to repository