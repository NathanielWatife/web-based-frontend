import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const CheckoutForm = ({ user, onSubmit, isProcessing }) => {
  const { cartItems, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    matricNo: user?.matric_no || '',
    department: user?.department || '',
    pickupLocation: 'Main Library',
    paymentMethod: 'paystack',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});

  const pickupLocations = [
    'Main Library',
    'ICT Building',
    'Student Affairs',
    'Departmental Office'
  ];

  const paymentMethods = [
    { id: 'paystack', name: 'Paystack', description: 'Card, Bank Transfer, USSD' },
    { id: 'flutterwave', name: 'Flutterwave', description: 'Card, Mobile Money' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
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

  const total = getCartTotal();
  const shippingFee = total > 0 ? 500 : 0;
  const grandTotal = total + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your.email@yabatech.edu.ng"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+234 800 000 0000"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="matricNo" className="block text-sm font-medium text-gray-700 mb-1">
                Matric Number
              </label>
              <input
                type="text"
                id="matricNo"
                name="matricNo"
                value={formData.matricNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CST/2021/001"
                disabled
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pickup Information</h3>
          
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location *
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pickupLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {pickupLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.pickupLocation && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              rows={3}
              value={formData.specialInstructions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions for your order..."
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method.id} className="flex items-center">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={method.id} className="ml-3 block text-sm font-medium text-gray-700">
                  <span className="font-semibold">{method.name}</span>
                  <span className="text-gray-500 ml-2">- {method.description}</span>
                </label>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              `Proceed to Pay ${formatCurrency(grandTotal)}`
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            By completing your purchase, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;