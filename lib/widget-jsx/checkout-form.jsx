
function CheckoutForm() {
  const initialData = window.__WIDGET_DATA__ || {
    cartItems: [],
    subtotal: 0
  };

  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [orderNumber, setOrderNumber] = React.useState('');

  const tax = initialData.subtotal * 0.1;
  const shipping = initialData.cartItems.length > 0 ? 15.00 : 0;
  const total = initialData.subtotal + tax + shipping;

  const steps = [
    { number: 1, title: 'Contact Info', icon: '📧' },
    { number: 2, title: 'Shipping', icon: '📍' },
    { number: 3, title: 'Payment', icon: '💳' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStep1Valid = () => {
    return formData.email && formData.firstName && formData.lastName;
  };

  const isStep2Valid = () => {
    return formData.street && formData.city && formData.state && formData.zip && formData.country;
  };

  const isStep3Valid = () => {
    return formData.cardNumber && formData.cardName && formData.expiry && formData.cvv;
  };

  const handleContinue = () => {
    if (currentStep === 3 && isStep3Valid()) {
      // Generate random order number
      setOrderNumber(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setCurrentStep(4);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .checkout-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .checkout-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .checkout-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .checkout-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .checkout-content {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .progress-bar {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .steps {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .progress-line {
          position: absolute;
          top: 30px;
          left: 60px;
          right: 60px;
          height: 4px;
          background: #e5e7eb;
          z-index: 0;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #667eea 100%);
          transition: width 0.5s ease;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .step-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #e5e7eb;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .step.completed .step-circle {
          background: #10b981;
        }

        .step.current .step-circle {
          background: #667eea;
          transform: scale(1.1);
        }

        .step-label {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
        }

        .step.current .step-label {
          color: #667eea;
        }

        .form-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group.full {
          grid-column: 1 / -1;
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

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back {
          background: #f3f4f6;
          color: #6b7280;
        }

        .btn-back:hover {
          background: #e5e7eb;
        }

        .btn-continue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-continue:hover {
          transform: scale(1.02);
        }

        .btn-continue:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .summary-items {
          margin-bottom: 1rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #6b7280;
        }

        .summary-row.total {
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .success-screen {
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
        }

        .success-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
        }

        .success-title {
          font-size: 2rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 1rem;
        }

        .order-number {
          font-size: 1.5rem;
          color: #667eea;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .success-message {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .summary-card {
            order: -1;
          }
        }
      `}</style>

      <div className="checkout-container">
        <div className="checkout-header">
          <div className="checkout-icon">🛍️</div>
          <h1>Checkout</h1>
        </div>

        {currentStep <= 3 && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="progress-bar">
              <div className="steps">
                <div className="progress-line">
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`step ${
                      step.number < currentStep
                        ? 'completed'
                        : step.number === currentStep
                        ? 'current'
                        : ''
                    }`}
                  >
                    <div className="step-circle">
                      {step.number < currentStep ? '✓' : step.icon}
                    </div>
                    <div className="step-label">{step.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="checkout-content">
          {currentStep === 1 && (
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="form-buttons">
                <button
                  className="btn btn-continue"
                  onClick={handleContinue}
                  disabled={!isStep1Valid()}
                >
                  Continue to Shipping
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-section">
              <h2 className="section-title">Shipping Address</h2>
              <div className="form-group">
                <label className="form-label">
                  Street Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    ZIP Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Country <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button className="btn btn-back" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="btn btn-continue"
                  onClick={handleContinue}
                  disabled={!isStep2Valid()}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-section">
              <h2 className="section-title">Payment Information</h2>
              <div className="form-group">
                <label className="form-label">
                  Card Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Cardholder Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Expiry Date <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    CVV <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button className="btn btn-back" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="btn btn-continue"
                  onClick={handleContinue}
                  disabled={!isStep3Valid()}
                >
                  Complete Purchase
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="success-screen" style={{ gridColumn: '1 / -1' }}>
              <div className="success-icon">✅</div>
              <h2 className="success-title">Order Confirmed!</h2>
              <div className="order-number">Order #{orderNumber}</div>
              <div className="success-message">
                <p>Thank you for your purchase!</p>
                <p>Your order total: <strong>${total.toFixed(2)}</strong></p>
                <p>A confirmation email has been sent to <strong>{formData.email}</strong></p>
              </div>
            </div>
          )}

          {currentStep <= 3 && (
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-items">
                {initialData.cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${initialData.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


// Mount the widget
const rootElement = document.getElementById('checkout-form-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<CheckoutForm />);
}
