import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutSteps from '../../components/checkout/CheckoutSteps/CheckoutSteps';
import ShippingForm from '../../components/checkout/ShippingForm/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm/PaymentForm';
import OrderReview from '../../components/checkout/OrderReview/OrderReview';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    shipping: {},
    payment: {}
  });

  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  if (cartItems.length === 0 && currentStep === 1) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping', active: currentStep === 1 },
    { number: 2, title: 'Payment', active: currentStep === 2 },
    { number: 3, title: 'Review', active: currentStep === 3 }
  ];

  const handleShippingSubmit = (shippingData) => {
    setOrderData(prev => ({
      ...prev,
      shipping: shippingData
    }));
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (paymentData) => {
    setOrderData(prev => ({
      ...prev,
      payment: paymentData
    }));
    setCurrentStep(3);
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // create order data for confirmation
      const orderData = {
        ...orderData,
        items: cartItems,
        total: getCartTotal()
      };

      const orderId = 'ORD-' + Date.now();
      await clearCart();
      
      // Redirect to order confirmation page
      navigate('/order-confirmation', { 
        state: { 
          orderId,
          orderData 
        }
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <CheckoutSteps 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </div>

        <div className="checkout-content">
          <div className="checkout-forms">
            {currentStep === 1 && (
              <ShippingForm 
                onSubmit={handleShippingSubmit}
                initialData={orderData.shipping}
                user={user}
              />
            )}

            {currentStep === 2 && (
              <PaymentForm 
                onSubmit={handlePaymentSubmit}
                initialData={orderData.payment}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <OrderReview 
                orderData={orderData}
                cartItems={cartItems}
                onEditShipping={() => setCurrentStep(1)}
                onEditPayment={() => setCurrentStep(2)}
                onSubmit={handleOrderSubmit}
                loading={loading}
              />
            )}
          </div>

          <div className="checkout-summary">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id || item.book.id} className="order-item">
                    <div className="item-image">
                      {item.book.cover_image ? (
                        <img src={item.book.cover_image} alt={item.book.title} />
                      ) : (
                        <div className="image-placeholder">📚</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.book.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ₦{(item.book.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₦{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>₦500</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>₦{(getCartTotal() * 0.075).toLocaleString()}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>
                    ₦{(getCartTotal() + 500 + (getCartTotal() * 0.075)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;