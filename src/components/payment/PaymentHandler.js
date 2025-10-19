import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/PaymentHandler.css';

const PaymentHandler = ({ order, onPaymentSuccess, onPaymentError }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const { clearCart } = useCart();
  const { user } = useAuth();

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const reference = `ORDER_${order._id}_${Date.now()}`;
      const amount = order.totalAmount;
      
      let paymentResponse;

      if (selectedMethod === 'paystack') {
        paymentResponse = await new Promise((resolve, reject) => {
          paymentService.initializePaystack(
            user.email,
            amount,
            reference,
            {
              order_id: order._id,
              matric_no: user.matricNo
            }
          );
          
          // This would typically be handled through webhooks
          setTimeout(() => {
            resolve({ reference, status: 'success' });
          }, 3000);
        });
      } else if (selectedMethod === 'flutterwave') {
        paymentResponse = await paymentService.initializeFlutterwave(
          user.email,
          amount,
          reference,
          {
            order_id: order._id,
            matric_no: user.matricNo
          }
        );
      }

      // Verify payment
      const verification = await paymentService.verifyPayment(paymentResponse.reference);
      
      if (verification.data.status === 'success') {
        clearCart();
        onPaymentSuccess(verification.data);
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-handler">
      <h3>Complete Payment</h3>
      
      <div className="payment-methods">
        <label className="payment-method">
          <input
            type="radio"
            name="paymentMethod"
            value="paystack"
            checked={selectedMethod === 'paystack'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <div className="method-content">
            <div className="method-icon">💳</div>
            <div className="method-info">
              <h4>Paystack</h4>
              <p>Pay with card, bank transfer, or USSD</p>
            </div>
          </div>
        </label>

        <label className="payment-method">
          <input
            type="radio"
            name="paymentMethod"
            value="flutterwave"
            checked={selectedMethod === 'flutterwave'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <div className="method-content">
            <div className="method-icon">🌍</div>
            <div className="method-info">
              <h4>Flutterwave</h4>
              <p>Pay with card, mobile money, or bank transfer</p>
            </div>
          </div>
        </label>
      </div>

      <div className="payment-summary">
        <div className="summary-row">
          <span>Order Total:</span>
          <span>₦{order.totalAmount?.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Payment Method:</span>
          <span>{selectedMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}</span>
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={processing}
        className="btn btn-primary w-100"
      >
        {processing ? (
          <>
            <LoadingSpinner size="small" />
            Processing Payment...
          </>
        ) : (
          `Pay ₦${order.totalAmount?.toLocaleString()}`
        )}
      </button>

      <div className="payment-security">
        <div className="security-badge">🔒 Secure Payment</div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default PaymentHandler;