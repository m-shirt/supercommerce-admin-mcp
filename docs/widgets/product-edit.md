# Phase 4.1: Product Edit Widget

## Overview

**Widget Purpose**: Quick edit form for product details
**Display Mode**: `inline` for conversational flow
**Primary CTAs**: "Save Changes", "Cancel" (max 2 actions)
**Tool(s) Required**:
- `get_details_product_by_id` - Load product data
- `update_variant_product` - Save product changes

## MCP Tool Definition

```javascript
// tools/supercommerce-api/edit-product-quick.js

const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const { product_id } = params;

    // Fetch product details
    const response = await fetch(
      `${baseURL}/api/admin/v2/products/${product_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in editProductQuick:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_product_quick',
      description: 'Quick edit product details with simple form',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: 'Product ID to edit'
          }
        },
        required: ['product_id']
      }
    },
    _meta: {
      'openai/outputTemplate': 'ui://widget/product-edit.html',
      'openai/toolInvocation/invoking': '✏️ Loading product editor...',
      'openai/toolInvocation/invoked': '✅ Editor ready'
    }
  }
};

export { apiTool };
```

## Resource Registration

```javascript
// lib/resources.js (add to getResourceByUri function)

if (uri === 'ui://widget/product-edit.html') {
  const widgetBaseUrl = process.env.WIDGET_BASE_URL || 'http://localhost:3000/widgets';

  return {
    uri: uri,
    mimeType: 'text/html+skybridge',
    text: `
<div id="product-edit-root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script type="module" src="${widgetBaseUrl}/product-edit.js"></script>
    `.trim()
  };
}
```

## Widget Implementation

```typescript
// widgets/src/product-edit.tsx

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  active: boolean;
  image?: string;
  description?: string;
  brand?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

function ProductEdit() {
  // Get product data from tool input
  const apiResponse = (window as any).openai?.toolInput;
  const initialProduct: Product = apiResponse?.data?.product || apiResponse?.product || {};

  // Form state
  const [formData, setFormData] = useState({
    name: initialProduct.name || '',
    price: initialProduct.price || 0,
    stock: initialProduct.stock || 0,
    active: initialProduct.active !== undefined ? initialProduct.active : true
  });

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Product name is required';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      setError('Please fix validation errors');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Call update_variant_product tool
      const result = await (window as any).openai?.callTool('update_variant_product', {
        product_id: initialProduct.id.toString(),
        name: formData.name,
        price: formData.price.toString(),
        stock: formData.stock.toString(),
        active: formData.active ? '1' : '0'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success - send confirmation message
      (window as any).openai?.sendMessage(
        `Product "${formData.name}" updated successfully!`
      );

    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    (window as any).openai?.sendMessage('Cancel product edit');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (!initialProduct || !initialProduct.id) {
    return (
      <>
        <style>{`
          .error-container {
            max-width: 500px;
            margin: 48px auto;
            padding: 32px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .error-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .error-message {
            font-size: 14px;
            color: #6b7280;
          }
        `}</style>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Product Not Found</div>
          <div className="error-message">Unable to load product details</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .edit-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .edit-header {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .product-image {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          object-fit: cover;
          background: #f3f4f6;
          flex-shrink: 0;
        }

        .header-info {
          flex: 1;
        }

        .edit-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .product-meta {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .product-meta strong {
          color: #374151;
          font-weight: 600;
        }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-label .required {
          color: #ef4444;
          margin-left: 4px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .field-error {
          margin-top: 4px;
          font-size: 12px;
          color: #ef4444;
        }

        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .checkbox-wrapper:hover {
          background: #f3f4f6;
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .checkbox-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-hint {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 2px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        @media (max-width: 640px) {
          .edit-container {
            padding: 16px;
          }

          .edit-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .input-group {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="edit-container">
        <div className="edit-header">
          <img
            src={initialProduct.image || `https://via.placeholder.com/100?text=${encodeURIComponent(initialProduct.name)}`}
            alt={initialProduct.name}
            className="product-image"
          />
          <div className="header-info">
            <h1 className="edit-title">Edit Product</h1>
            <div className="product-meta">
              <strong>SKU:</strong> {initialProduct.sku}
            </div>
            {initialProduct.brand && (
              <div className="product-meta">
                <strong>Brand:</strong> {initialProduct.brand.name}
              </div>
            )}
            {initialProduct.category && (
              <div className="product-meta">
                <strong>Category:</strong> {initialProduct.category.name}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-banner">{error}</div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Product Name */}
          <div className="form-section">
            <label className="form-label">
              Product Name<span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${validationErrors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
            />
            {validationErrors.name && (
              <div className="field-error">{validationErrors.name}</div>
            )}
          </div>

          {/* Price and Stock */}
          <div className="input-group">
            <div className="form-section">
              <label className="form-label">
                Price<span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${validationErrors.price ? 'error' : ''}`}
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              {validationErrors.price && (
                <div className="field-error">{validationErrors.price}</div>
              )}
            </div>

            <div className="form-section">
              <label className="form-label">
                Stock Quantity<span className="required">*</span>
              </label>
              <input
                type="number"
                min="0"
                className={`form-input ${validationErrors.stock ? 'error' : ''}`}
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              {validationErrors.stock && (
                <div className="field-error">{validationErrors.stock}</div>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="form-section">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
              />
              <div>
                <div className="checkbox-label">Active Product</div>
                <div className="checkbox-hint">
                  {formData.active
                    ? 'Product is visible and available for purchase'
                    : 'Product is hidden from customers'}
                </div>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// Mount the widget
const rootElement = document.getElementById('product-edit-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ProductEdit />);
}
```

## Test Scenarios

### Scenario 1: Load Product Editor
**User**: "Edit product #12345"
**Action**: Claude calls `edit_product_quick` with product_id
**Result**: Widget loads with product data pre-filled in form

### Scenario 2: Save Valid Changes
**User**: Updates name, price, and stock, clicks "Save Changes"
**Action**: Widget validates form and calls `update_variant_product`
**Result**: Product updated, confirmation message sent

### Scenario 3: Validation Errors
**User**: Clears product name, clicks "Save Changes"
**Result**: Validation error displayed "Product name is required"

### Scenario 4: Toggle Active Status
**User**: Unchecks "Active Product" checkbox
**Result**: Hint text updates to show product will be hidden

### Scenario 5: Cancel Edit
**User**: Makes changes and clicks "Cancel"
**Result**: Message sent to Claude, no changes saved

### Scenario 6: API Error
**Context**: `update_variant_product` returns error
**Result**: Error banner displayed with error message

## Integration Points

1. **Product Grid → Product Edit**:
   - User requests to edit product
   - Claude calls `edit_product_quick` with product ID
   - Widget loads with product data

2. **Product Edit → Confirmation**:
   - User saves changes successfully
   - Widget sends confirmation message
   - Claude can show updated product or return to grid

3. **Validation**:
   - Client-side validation before API call
   - Real-time error clearing as user types
   - Field-level error messages

4. **Form State**:
   - Form pre-populated with current product data
   - Changes tracked in local state
   - No persistent widget state needed

## Data Flow

```typescript
// API Response Structure (get_details_product_by_id)
{
  data: {
    product: {
      id: 12345,
      name: "Premium Widget",
      sku: "WIDGET-001",
      price: 99.99,
      stock: 50,
      active: true,
      image: "https://...",
      description: "A premium widget",
      brand: {
        id: 1,
        name: "Brand Name"
      },
      category: {
        id: 5,
        name: "Electronics"
      }
    }
  }
}

// Update Request (update_variant_product)
{
  product_id: "12345",
  name: "Premium Widget Updated",
  price: "109.99",
  stock: "45",
  active: "1"
}
```

## Widget State Schema

This widget does not use persistent widget state - it manages form state locally.

## Build Configuration

```javascript
// widgets/build.js
await esbuild.build({
  entryPoints: ['./src/product-edit.tsx'],
  bundle: true,
  format: 'esm',
  outfile: '../public/widgets/product-edit.js',
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

## Validation Rules

1. **Product Name**:
   - Required field
   - Cannot be empty or whitespace only

2. **Price**:
   - Required field
   - Must be greater than 0
   - Supports decimal values (e.g., 99.99)

3. **Stock**:
   - Required field
   - Must be 0 or greater
   - Integer values only

4. **Active**:
   - Boolean field
   - Defaults to true if not specified

## Status

✅ **Complete** - Ready for production implementation
