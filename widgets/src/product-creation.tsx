import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal } from '../hooks';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  sku: string;
  price: string;
  stock: string;
  categoryId: string;
  brandId: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
  categoryId?: string;
  brandId?: string;
}

function ProductCreation() {
  // Track toolOutput changes
  const [toolOutput, setToolOutput] = useState<any>((window as any).openai?.toolOutput);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentOutput = (window as any).openai?.toolOutput;
      if (currentOutput !== toolOutput) {
        setToolOutput(currentOutput);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [toolOutput]);

  // Parse categories and brands from toolOutput
  const { categories, brands } = useMemo(() => {
    let data = {
      categories: [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' },
        { id: 3, name: 'Books' }
      ],
      brands: [
        { id: 1, name: 'Brand A' },
        { id: 2, name: 'Brand B' },
        { id: 3, name: 'Brand C' }
      ]
    };

    if (toolOutput?.result?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.result.content[0].text);
        if (apiResponse?.categories) data.categories = apiResponse.categories;
        if (apiResponse?.brands) data.brands = apiResponse.brands;
      } catch (e) {
        console.error('Failed to parse product creation data:', e);
      }
    } else if (toolOutput?.content?.[0]?.text) {
      try {
        const apiResponse = JSON.parse(toolOutput.content[0].text);
        if (apiResponse?.categories) data.categories = apiResponse.categories;
        if (apiResponse?.brands) data.brands = apiResponse.brands;
      } catch (e) {
        console.error('Failed to parse product creation data:', e);
      }
    }

    return data;
  }, [toolOutput]);

  // Display mode for responsive layout
  const displayMode = useOpenAiGlobal('displayMode');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    price: '',
    stock: '',
    categoryId: '',
    brandId: '',
    description: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Product name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        break;
      case 'sku':
        if (!value.trim()) return 'SKU is required';
        if (!/^[A-Z0-9-]+$/.test(value)) return 'SKU must contain only uppercase letters, numbers, and hyphens';
        break;
      case 'price':
        if (!value) return 'Price is required';
        if (parseFloat(value) <= 0) return 'Price must be greater than 0';
        break;
      case 'stock':
        if (!value) return 'Stock is required';
        if (parseInt(value) < 0) return 'Stock cannot be negative';
        break;
      case 'categoryId':
        if (!value) return 'Category is required';
        break;
      case 'brandId':
        if (!value) return 'Brand is required';
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      if (['name', 'sku', 'price', 'stock', 'categoryId', 'brandId'].includes(key)) {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Send message to Claude with product data
    const productData = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      brandId: parseInt(formData.brandId),
      description: formData.description,
      imageUrl: formData.imageUrl
    };

    (window as any).openai?.sendFollowUpMessage?.(`Create new product: ${JSON.stringify(productData, null, 2)}`);

    // Reset form after short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '',
        categoryId: '',
        brandId: '',
        description: '',
        imageUrl: ''
      });
      setTouched({});
      setErrors({});
    }, 1000);
  };

  const selectedCategory = categories.find(c => c.id === parseInt(formData.categoryId));
  const selectedBrand = brands.find(b => b.id === parseInt(formData.brandId));

  return (
    <div className={`product-creation-container ${displayMode}`}>
      <style>{`
        .product-creation-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .creation-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .creation-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .creation-subtitle {
          color: white;
          font-size: 1rem;
          opacity: 0.9;
        }

        .creation-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .product-creation-container:not(.pip) .creation-content {
          grid-template-columns: 1fr 1fr;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .preview-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 1rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #ef4444;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .preview-product {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 3rem;
        }

        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-info {
          padding: 1.5rem;
        }

        .preview-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
          min-height: 1.5rem;
        }

        .preview-sku {
          font-family: monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .preview-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #f3f4f6;
          color: #6b7280;
        }

        .preview-price {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .preview-stock {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .preview-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .empty-preview {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .product-creation-container:not(.pip) .creation-content {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .preview-card {
            position: static;
          }
        }
      `}</style>

      <div className="creation-header">
        <h1 className="creation-title">Create New Product</h1>
        <div className="creation-subtitle">Fill in the details below to add a new product</div>
      </div>

      <div className="creation-content">
        <div className="form-card">
          <h2 className="card-title">Product Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter product name"
              />
              {touched.name && errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                SKU <span className="required">*</span>
              </label>
              <input
                type="text"
                name="sku"
                className={`form-input ${touched.sku && errors.sku ? 'error' : ''}`}
                value={formData.sku}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="PROD-12345"
              />
              {touched.sku && errors.sku && (
                <div className="error-message">{errors.sku}</div>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Price <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  className={`form-input ${touched.price && errors.price ? 'error' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {touched.price && errors.price && (
                  <div className="error-message">{errors.price}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Stock <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  className={`form-input ${touched.stock && errors.stock ? 'error' : ''}`}
                  value={formData.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="0"
                />
                {touched.stock && errors.stock && (
                  <div className="error-message">{errors.stock}</div>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="categoryId"
                  className={`form-select ${touched.categoryId && errors.categoryId ? 'error' : ''}`}
                  value={formData.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {touched.categoryId && errors.categoryId && (
                  <div className="error-message">{errors.categoryId}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Brand <span className="required">*</span>
                </label>
                <select
                  name="brandId"
                  className={`form-select ${touched.brandId && errors.brandId ? 'error' : ''}`}
                  value={formData.brandId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
                {touched.brandId && errors.brandId && (
                  <div className="error-message">{errors.brandId}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </button>
          </form>
        </div>

        <div className="preview-card">
          <h2 className="card-title">Preview</h2>
          {formData.name || formData.price || formData.imageUrl ? (
            <div className="preview-product">
              <div className="preview-image">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt={formData.name || 'Product'} />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className="preview-info">
                <h3 className="preview-name">{formData.name || 'Product Name'}</h3>
                {formData.sku && (
                  <div className="preview-sku">SKU: {formData.sku}</div>
                )}
                <div className="preview-badges">
                  {selectedCategory && (
                    <span className="preview-badge">{selectedCategory.name}</span>
                  )}
                  {selectedBrand && (
                    <span className="preview-badge">{selectedBrand.name}</span>
                  )}
                </div>
                {formData.price && (
                  <div className="preview-price">${parseFloat(formData.price).toFixed(2)}</div>
                )}
                {formData.stock && (
                  <div className="preview-stock">In Stock: {formData.stock} units</div>
                )}
                {formData.description && (
                  <div className="preview-description">{formData.description}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              <div className="empty-icon">📦</div>
              <div>Start filling the form to see preview</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mount widget
const root = document.getElementById('product-creation-root');
if (root) {
  ReactDOM.createRoot(root).render(<ProductCreation />);
}
