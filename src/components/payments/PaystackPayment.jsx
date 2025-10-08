import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { PAYSTACK_PUBLIC_KEY } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const PaystackPayment = ({ order, onSuccess, onError, isProcessing }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: order.customerDetails.email,
    amount: Math.round(order.total_price * 100), // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: "Order Number",
          variable_name: "order_number",
          value: order.order_number
        },
        {
          display_name: "Matric Number",
          variable_name: "matric_number",
          value: order.customerDetails.matricNo
        },
        {
          display_name: "Pickup Location",
          variable_name: "pickup_location",
          value: order.pickup_location
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccessCallback = (reference) => {
    console.log('Payment successful:', reference);
    onSuccess({
      reference: reference.reference,
      provider: 'paystack',
      metadata: reference
    });
  };

  const onCloseCallback = () => {
    console.log('Payment dialog closed');
    onError(new Error('Payment was cancelled'));
  };

  const handlePayment = () => {
    initializePayment(onSuccessCallback, onCloseCallback);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pay with Paystack</h3>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">Supported Payment Methods:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Debit/Credit Cards (Visa, MasterCard, Verve)</li>
          <li>• Bank Transfer</li>
          <li>• USSD</li>
          <li>• Mobile Money</li>
        </ul>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </div>
        ) : (
          `Pay ${formatCurrency(order.total_price)} with Paystack`
        )}
      </button>

      <div className="mt-4 text-center">
        <img 
          src="/paystack-logo.png" 
          alt="Paystack" 
          className="h-8 mx-auto opacity-50"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default PaystackPayment;