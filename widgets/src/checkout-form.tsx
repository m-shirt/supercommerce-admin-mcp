import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useOpenAiGlobal } from '../hooks';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

function CheckoutForm() {
  // Get data from tool invocation
  const toolInput = (window as any).openai?.toolInput;
  const apiResponse = toolInput || {};

  const cartItems: CartItem[] = apiResponse?.cartItems || [];
  const customers: Customer[] = apiResponse?.customers || [];
  const paymentMethods: PaymentMethod[] = apiResponse?.paymentMethods || [];
  const cities: City[] = apiResponse?.cities || [];
  const subtotal = apiResponse?.subtotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const displayMode = useOpenAiGlobal('displayMode');

  const [formData, setFormData] = useState({
    customerId: '',
    address: '',
    cityId: '',
    phone: '',
    paymentMethodId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) newErrors.customerId = 'Please select a customer';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.cityId) newErrors.cityId = 'Please select a city';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.paymentMethodId) newErrors.paymentMethodId = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id.toString() === formData.customerId);
    const selectedCity = cities.find(c => c.id.toString() === formData.cityId);
    const selectedPayment = paymentMethods.find(p => p.id.toString() === formData.paymentMethodId);

    const orderDetails = {
      customer: selectedCustomer?.name,
      address: formData.address,
      city: selectedCity?.name,
      phone: formData.phone,
      paymentMethod: selectedPayment?.name,
      notes: formData.notes,
      total: (subtotal + tax + shipping).toFixed(2)
    };

    (window as any).openai?.sendMessage(`Create order: ${JSON.stringify(orderDetails)}`);
  };

  const tax = subtotal * 0.1;
  const shipping = 15;
  const total = subtotal + tax + shipping;

  return (
    <div className={`checkout-container ${displayMode}`}>
      <style>{`
        .checkout-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .checkout-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .checkout-container:not(.pip) .checkout-content {
          grid-template-columns: 1.5fr 1fr;
        }

        .checkout-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-label.required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #ef4444;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .order-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .summary-items {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .summary-row:last-of-type {
          border-bottom: none;
          padding-top: 1rem;
          margin-top: 0.5rem;
          border-top: 2px solid #e5e7eb;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          font-weight: 600;
          color: #1f2937;
        }

        .summary-row:last-of-type .summary-label,
        .summary-row:last-of-type .summary-value {
          color: #667eea;
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
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .checkout-container:not(.pip) .checkout-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Customer Information</h2>
            <div className="form-group">
              <label className="form-label required">Customer</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`form-select ${errors.customerId ? 'error' : ''}`}
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
              {errors.customerId && <div className="form-error">{errors.customerId}</div>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Delivery Address</h2>
            <div className="form-group">
              <label className="form-label required">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="123 Main St, Apt 4B"
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">City</label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className={`form-select ${errors.cityId ? 'error' : ''}`}
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              {errors.cityId && <div className="form-error">{errors.cityId}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Payment Method</h2>
            <div className="form-group">
              <label className="form-label required">Payment Method</label>
              <select
                name="paymentMethodId"
                value={formData.paymentMethodId}
                onChange={handleChange}
                className={`form-select ${errors.paymentMethodId ? 'error' : ''}`}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
              {errors.paymentMethodId && <div className="form-error">{errors.paymentMethodId}</div>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Additional Notes</h2>
            <div className="form-group">
              <label className="form-label">Order Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </div>
        </form>

        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          {cartItems.length > 0 && (
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Tax (10%)</span>
            <span className="summary-value">${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Shipping</span>
            <span className="summary-value">${shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Total</span>
            <span className="summary-value">${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={cartItems.length === 0}
          >
            Place Order ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mount widget
const root = document.getElementById('checkout-form-root');
if (root) {
  ReactDOM.createRoot(root).render(<CheckoutForm />);
}
