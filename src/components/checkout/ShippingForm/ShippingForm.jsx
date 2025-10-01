import React, { useState } from 'react';
import './ShippingForm.css';

const ShippingForm = ({ onSubmit, initialData, user }) => {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || user?.first_name || '',
    last_name: initialData.last_name || user?.last_name || '',
    email: initialData.email || user?.email || '',
    phone: initialData.phone || user?.phone_number || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    postal_code: initialData.postal_code || '',
    country: initialData.country || 'Nigeria',
    shipping_method: initialData.shipping_method || 'standard'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
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

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  return (
    <div className="shipping-form">
      <h2>Shipping Information</h2>
      <p>Enter your shipping details to proceed with your order</p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? 'error' : ''}
              placeholder="Enter your first name"
            />
            {errors.first_name && <span className="field-error">{errors.first_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? 'error' : ''}
              placeholder="Enter your last name"
            />
            {errors.last_name && <span className="field-error">{errors.last_name}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Shipping Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter your complete address"
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
              placeholder="Enter your city"
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            >
              <option value="">Select State</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <span className="field-error">{errors.state}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postal_code">Postal Code *</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className={errors.postal_code ? 'error' : ''}
              placeholder="Enter postal code"
            />
            {errors.postal_code && <span className="field-error">{errors.postal_code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="form-group">
          <label>Shipping Method</label>
          <div className="shipping-options">
            <label className="shipping-option">
              <input
                type="radio"
                name="shipping_method"
                value="standard"
                checked={formData.shipping_method === 'standard'}
                onChange={handleChange}
              />
              <div className="option-content">
                <span className="option-title">Standard Shipping</span>
                <span className="option-duration">3-5 business days</span>
                <span className="option-price">₦500</span>
              </div>
            </label>

            <label className="shipping-option">
              <input
                type="radio"
                name="shipping_method"
                value="express"
                checked={formData.shipping_method === 'express'}
                onChange={handleChange}
              />
              <div className="option-content">
                <span className="option-title">Express Shipping</span>
                <span className="option-duration">1-2 business days</span>
                <span className="option-price">₦1,500</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-large">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;