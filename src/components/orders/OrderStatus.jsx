import React from 'react';

const OrderStatus = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', description: 'Payment pending' },
    { key: 'paid', label: 'Payment Confirmed', description: 'Payment received' },
    { key: 'processing', label: 'Processing', description: 'Preparing your order' },
    { key: 'ready', label: 'Ready for Pickup', description: 'Ready at location' },
    { key: 'completed', label: 'Completed', description: 'Order fulfilled' }
  ];

  const cancelledSteps = [
    { key: 'cancelled', label: 'Cancelled', description: 'Order cancelled' }
  ];

  const currentSteps = status === 'cancelled' ? cancelledSteps : steps;
  const currentIndex = currentSteps.findIndex(step => step.key === status);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
      
      <div className="space-y-4">
        {currentSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isCancelled = status === 'cancelled';

          return (
            <div key={step.key} className="flex items-start space-x-4">
              {/* Step Indicator */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCancelled
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : isCompleted
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : isCurrent
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  {isCancelled ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Connector Line */}
                {index < currentSteps.length - 1 && (
                  <div
                    className={`h-8 w-0.5 mx-auto ${
                      isCompleted && !isCancelled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-6">
                <div
                  className={`font-medium ${
                    isCancelled
                      ? 'text-red-700'
                      : isCompleted
                      ? 'text-green-700'
                      : isCurrent
                      ? 'text-blue-700'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {step.description}
                </div>
                
                {/* Additional Info for Current Step */}
                {isCurrent && status === 'ready' && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      Your order is ready for pickup!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Please bring your student ID to the designated pickup location.
                    </p>
                  </div>
                )}
                
                {isCurrent && status === 'pending' && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Waiting for payment confirmation. Please complete your payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatus;