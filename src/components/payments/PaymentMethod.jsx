import React, { useState } from 'react';
import PaystackPayment from './PaystackPayment';
import FlutterwavePayment from './FlutterwavePayment';
import { formatCurrency } from '../../utils/helpers';

const PaymentMethod = ({ order, onPaymentSuccess, onPaymentError, isProcessing }) => {
  const [selectedMethod, setSelectedMethod] = useState(order.payment_method);

  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Paystack',
      description: 'Pay with card, bank transfer, or USSD',
      icon: '💳'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      description: 'Pay with card or mobile money',
      icon: '📱'
    }
  ];

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'paystack':
        return (
          <PaystackPayment
            order={order}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            isProcessing={isProcessing}
          />
        );
      case 'flutterwave':
        return (
          <FlutterwavePayment
            order={order}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Order Number:</span>
          <span className="text-sm font-semibold text-gray-900">{order.order_number}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Total Amount:</span>
          <span className="text-lg font-bold text-blue-600">
            {formatCurrency(order.total_price)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="border-t border-gray-200 pt-6">
        {renderPaymentForm()}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm text-yellow-800">
            Your payment information is secure and encrypted.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;