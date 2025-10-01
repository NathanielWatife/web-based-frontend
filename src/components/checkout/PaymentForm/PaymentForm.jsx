import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ onSubmit, initialData, onBack }) => {
  const [formData, setFormData] = useState({
    payment_method: initialData.payment_method || 'card',
    card_number: initialData.card_number || '',
    card_holder: initialData.card_holder || '',
    expiry_date: initialData.expiry_date || '',
    cvv: initialData.cvv || '',
    save_card: initialData.save_card || false
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'paystack',
      name: 'Paystack',
      icon: '🔒',
      description: 'Secure online payments'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: '🌍',
      description: 'African payment solution'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer directly to our account'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePaymentMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      payment_method: methodId
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      card_number: formatted
    }));
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      expiry_date: formatted
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.payment_method) {
      newErrors.payment_method = 'Please select a payment method';
    }

    if (formData.payment_method === 'card') {
      if (!formData.card_number.trim()) {
        newErrors.card_number = 'Card number is required';
      } else if (formData.card_number.replace(/\s/g, '').length !== 16) {
        newErrors.card_number = 'Card number must be 16 digits';
      }

      if (!formData.card_holder.trim()) {
        newErrors.card_holder = 'Card holder name is required';
      }

      if (!formData.expiry_date.trim()) {
        newErrors.expiry_date = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry_date)) {
        newErrors.expiry_date = 'Invalid expiry date format (MM/YY)';
      } else {
        const [month, year] = formData.expiry_date.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const today = new Date();
        if (expiry < today) {
          newErrors.expiry_date = 'Card has expired';
        }
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="payment-form">
      <h2>Payment Method</h2>
      <p>Choose your preferred payment method</p>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="form-group">
          <label>Select Payment Method *</label>
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <label
                key={method.id}
                className={`payment-method ${
                  formData.payment_method === method.id ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={formData.payment_method === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                  className="sr-only"
                />
                <div className="method-content">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <div className="method-name">{method.name}</div>
                    <div className="method-description">{method.description}</div>
                  </div>
                  <div className="method-check">✓</div>
                </div>
              </label>
            ))}
          </div>
          {errors.payment_method && (
            <span className="field-error">{errors.payment_method}</span>
          )}
        </div>

        {/* Card Details (only show if card is selected) */}
        {formData.payment_method === 'card' && (
          <div className="card-details">
            <div className="form-group">
              <label htmlFor="card_number">Card Number *</label>
              <input
                type="text"
                id="card_number"
                name="card_number"
                value={formData.card_number}
                onChange={handleCardNumberChange}
                className={errors.card_number ? 'error' : ''}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.card_number && (
                <span className="field-error">{errors.card_number}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="card_holder">Card Holder Name *</label>
              <input
                type="text"
                id="card_holder"
                name="card_holder"
                value={formData.card_holder}
                onChange={handleChange}
                className={errors.card_holder ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.card_holder && (
                <span className="field-error">{errors.card_holder}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry_date">Expiry Date *</label>
                <input
                  type="text"
                  id="expiry_date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleExpiryDateChange}
                  className={errors.expiry_date ? 'error' : ''}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry_date && (
                  <span className="field-error">{errors.expiry_date}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className={errors.cvv ? 'error' : ''}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <span className="field-error">{errors.cvv}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="save_card"
                  checked={formData.save_card}
                  onChange={handleChange}
                />
                <span>Save card details for future purchases</span>
              </label>
            </div>
          </div>
        )}

        {/* Payment Gateway Info */}
        {formData.payment_method === 'paystack' && (
          <div className="payment-gateway-info">
            <div className="gateway-message">
              <h4>Paystack Payment</h4>
              <p>You will be redirected to Paystack to complete your payment securely.</p>
              <ul>
                <li>✅ Secure payment processing</li>
                <li>✅ Multiple card options</li>
                <li>✅ Bank transfers supported</li>
                <li>✅ Instant confirmation</li>
              </ul>
            </div>
          </div>
        )}

        {formData.payment_method === 'flutterwave' && (
          <div className="payment-gateway-info">
            <div className="gateway-message">
              <h4>Flutterwave Payment</h4>
              <p>You will be redirected to Flutterwave to complete your payment.</p>
              <ul>
                <li>✅ African payment solutions</li>
                <li>✅ Mobile money supported</li>
                <li>✅ Multiple currencies</li>
                <li>✅ Secure transactions</li>
              </ul>
            </div>
          </div>
        )}

        {formData.payment_method === 'bank_transfer' && (
          <div className="payment-gateway-info">
            <div className="gateway-message">
              <h4>Bank Transfer</h4>
              <p>Transfer funds directly to our bank account:</p>
              <div className="bank-details">
                <div className="bank-detail">
                  <strong>Bank:</strong> Yaba College Microfinance Bank
                </div>
                <div className="bank-detail">
                  <strong>Account Name:</strong> Yaba College Bookshop
                </div>
                <div className="bank-detail">
                  <strong>Account Number:</strong> 1234567890
                </div>
                <div className="bank-detail">
                  <strong>Reference:</strong> Order #{(Date.now() % 1000000).toString().padStart(6, '0')}
                </div>
              </div>
              <p className="note">
                <strong>Note:</strong> Orders will be processed after payment confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <div className="security-text">
            <strong>Your payment is secure</strong>
            <p>We use industry-standard encryption to protect your information</p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-outline"
          >
            ← Back to Shipping
          </button>
          <button type="submit" className="btn btn-primary btn-large">
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;