import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/orders';
import { paymentsAPI } from '../services/payments';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethod from '../components/payments/PaymentMethod';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const shippingFee = total > 0 ? 500 : 0;
  const grandTotal = total + shippingFee;

  // Redirect if not authenticated or cart is empty
  if (!isAuthenticated) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const hasOutOfStockItems = cartItems.some(item => item.quantity > item.stock_quantity);
  if (hasOutOfStockItems) {
    navigate('/cart');
    return null;
  }

  const handleDetailsSubmit = async (formData) => {
    setIsProcessing(true);
    
    try {
      // Create order
      const orderPayload = {
        items: cartItems.map(item => ({
          book: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: grandTotal,
        pickup_location: formData.pickupLocation,
        payment_method: formData.paymentMethod
      };

      const order = await ordersAPI.createOrder(orderPayload);
      setOrderData({
        ...order,
        customerDetails: formData
      });
      setCurrentStep(2);
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Verify payment
      const verificationPayload = {
        payment_reference: paymentData.reference,
        provider: orderData.payment_method
      };

      const verifiedPayment = await paymentsAPI.verifyPayment(
        orderData.payment_method,
        verificationPayload
      );

      if (verifiedPayment.status === 'success') {
        setCurrentStep(3);
        clearCart();
        toast.success('Payment successful! Order confirmed.');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    toast.error(`Payment failed: ${error.message}`);
  };

  const steps = [
    { number: 1, title: 'Order Details', description: 'Review your order' },
    { number: 2, title: 'Payment', description: 'Choose payment method' },
    { number: 3, title: 'Confirmation', description: 'Order confirmed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>›</span>
            <span>Cart</span>
            <span>›</span>
            <span className="text-gray-900">Checkout</span>
          </nav>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    } ${
                      currentStep === step.number ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <CheckoutForm
                user={user}
                onSubmit={handleDetailsSubmit}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 2 && orderData && (
              <PaymentMethod
                order={orderData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 3 && orderData && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Confirmed!
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    Thank you for your purchase. Your order has been received and is being processed.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderData.order_number}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Total: {formatCurrency(orderData.total_price)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/orders')}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Order Details
                    </button>
                    
                    <button
                      onClick={() => navigate('/books')}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                    <ul className="text-sm text-blue-800 space-y-1 text-left">
                      <li>• You will receive an order confirmation email</li>
                      <li>• We'll notify you when your order is ready for pickup</li>
                      <li>• Pickup location: {orderData.pickup_location}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              total={total}
              shippingFee={shippingFee}
              grandTotal={grandTotal}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;