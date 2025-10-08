import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const OrderSummary = ({ cartItems, total, shippingFee, grandTotal, currentStep }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-3 h-4 bg-blue-300 mx-auto mb-1 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm font-semibold text-blue-600">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(total)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shippingFee > 0 ? formatCurrency(shippingFee) : 'Free'}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {currentStep === 1 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Campus Pickup</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Free campus pickup</li>
            <li>• Ready within 24-48 hours</li>
            <li>• Bring your student ID</li>
          </ul>
        </div>
      )}

      {currentStep === 2 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Secure Payment</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• PCI DSS compliant</li>
            <li>• Encrypted transaction</li>
            <li>• Money-back guarantee</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;