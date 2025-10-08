import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { FLUTTERWAVE_PUBLIC_KEY } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const FlutterwavePayment = ({ order, onSuccess, onError, isProcessing }) => {
  const config = {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: order.total_price,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: order.customerDetails.email,
      phone_number: order.customerDetails.phone,
      name: `${order.customerDetails.first_name} ${order.customerDetails.last_name}`
    },
    customizations: {
      title: 'YabaTech BookStore',
      description: `Payment for Order #${order.order_number}`,
      logo: '/logo.png'
    },
    meta: {
      order_number: order.order_number,
      matric_number: order.customerDetails.matricNo,
      pickup_location: order.pickup_location
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log('Flutterwave response:', response);
        
        if (response.status === 'successful') {
          onSuccess({
            reference: response.transaction_id || response.tx_ref,
            provider: 'flutterwave',
            metadata: response
          });
        } else {
          onError(new Error('Payment failed or was cancelled'));
        }
        closePaymentModal();
      },
      onClose: () => {
        onError(new Error('Payment was cancelled'));
      }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pay with Flutterwave</h3>
      
      <div className="bg-orange-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-orange-900 mb-2">Supported Payment Methods:</h4>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Debit/Credit Cards</li>
          <li>• Mobile Money</li>
          <li>• Bank Transfer</li>
          <li>• USSD</li>
        </ul>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          `Pay ${formatCurrency(order.total_price)} with Flutterwave`
        )}
      </button>

      <div className="mt-4 text-center">
        <img 
          src="/flutterwave-logo.png" 
          alt="Flutterwave" 
          className="h-6 mx-auto opacity-50"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default FlutterwavePayment;